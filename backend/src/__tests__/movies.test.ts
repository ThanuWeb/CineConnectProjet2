import request from "supertest";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockMovieRepo = {
  getAllMovies: jest.fn(),
  getMovieById: jest.fn(),
};

jest.mock("../Infrastructure/Repository/MovieRepository", () => ({
  MovieRepository: jest.fn(() => mockMovieRepo),
}));
jest.mock("../Infrastructure/Repository/UserRepository", () => ({
  UserRepository: jest.fn(() => ({})),
}));
jest.mock("../config/env", () => ({
  env: {
    PORT: 3000,
    DATABASE_URL: "fake",
    FRONTEND_ORIGIN: "http://localhost:5173",
    JWT_SECRET: "test-secret",
  },
}));
jest.mock("../Infrastructure/drizzle", () => ({ db: {} }));
jest.mock("../Infrastructure/DB", () => ({ pool: {} }));

process.env.JWT_SECRET = "test-secret";

import { app } from "../app";

const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
  expiresIn: "1h",
});

describe("GET /movies", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait retourner la liste des films", async () => {
    mockMovieRepo.getAllMovies.mockResolvedValue([
      { id: "m1", title: "Inception", year: 2010 },
      { id: "m2", title: "Matrix", year: 1999 },
    ]);

    const res = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe("Inception");
  });

  it("devrait retourner 401 sans token", async () => {
    const res = await request(app).get("/movies");
    expect(res.status).toBe(401);
  });
});

describe("GET /movies/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait retourner un film par ID", async () => {
    mockMovieRepo.getMovieById.mockResolvedValue({
      id: "m1",
      title: "Inception",
    });

    const res = await request(app)
      .get("/movies/m1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Inception");
  });

  it("devrait retourner 404 si film non trouvé", async () => {
    mockMovieRepo.getMovieById.mockResolvedValue(null);

    const res = await request(app)
      .get("/movies/unknown")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("GET /movies - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockMovieRepo.getAllMovies.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("GET /movies/:id - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockMovieRepo.getMovieById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/movies/m1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("MovieController.getMovieById - ID non string", () => {
  it("devrait retourner 400 si id n'est pas un string", async () => {
    const { MovieController } = require("../Controllers/MovieController");
    const req = { params: { id: ["array"] } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await MovieController.getMovieById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
