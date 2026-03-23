import request from "supertest";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockCatRepo = {
  getAllCategories: jest.fn(),
  addCategory: jest.fn(),
  getCategoriesByFilmId: jest.fn(),
  addFilmCategory: jest.fn(),
};

jest.mock("../Infrastructure/Repository/CategoryRepository", () => ({
  CategoryRepository: jest.fn(() => mockCatRepo),
}));
jest.mock("../Infrastructure/Repository/UserRepository", () => ({
  UserRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/MovieRepository", () => ({
  MovieRepository: jest.fn(() => ({})),
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

describe("GET /categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait lister les catégories (pas besoin de token)", async () => {
    mockCatRepo.getAllCategories.mockResolvedValue([
      { id: "c1", name: "Action" },
    ]);

    const res = await request(app).get("/categories");

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Action");
  });
});

describe("POST /categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait créer une catégorie", async () => {
    mockCatRepo.addCategory.mockResolvedValue({
      id: "c2",
      name: "Drame",
      description: null,
    });

    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Drame" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Drame");
  });

  it("devrait retourner 400 sans nom", async () => {
    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("GET /movies/:id/categories", () => {
  it("devrait retourner les catégories d'un film", async () => {
    mockCatRepo.getCategoriesByFilmId.mockResolvedValue([
      { id: "c1", name: "Sci-Fi" },
    ]);

    const res = await request(app).get("/movies/m1/categories");

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Sci-Fi");
  });
});

describe("POST /movies/:id/categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait associer une catégorie à un film", async () => {
    mockCatRepo.addFilmCategory.mockResolvedValue(undefined);

    const res = await request(app)
      .post("/movies/m1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: "c1" });

    expect(res.status).toBe(201);
  });

  it("devrait retourner 400 sans categoryId", async () => {
    const res = await request(app)
      .post("/movies/m1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("GET /categories - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockCatRepo.getAllCategories.mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/categories");

    expect(res.status).toBe(500);
  });
});

describe("POST /categories - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockCatRepo.addCategory.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Horror" });

    expect(res.status).toBe(500);
  });
});

describe("GET /movies/:id/categories - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockCatRepo.getCategoriesByFilmId.mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/movies/m1/categories");

    expect(res.status).toBe(500);
  });
});

describe("POST /movies/:id/categories - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockCatRepo.addFilmCategory.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/movies/m1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId: "c1" });

    expect(res.status).toBe(500);
  });
});
