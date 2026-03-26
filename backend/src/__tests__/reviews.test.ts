import request from "supertest";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockReviewRepo = {
  getReviewsByFilmId: jest.fn(),
  getReviewByUserAndFilm: jest.fn(),
  addReview: jest.fn(),
  getReviewById: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
};

jest.mock("../Infrastructure/Repository/ReviewRepository", () => ({
  ReviewRepository: jest.fn(() => mockReviewRepo),
}));
jest.mock("../Infrastructure/Repository/UserRepository", () => ({
  UserRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/MovieRepository", () => ({
  MovieRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/CategoryRepository", () => ({
  CategoryRepository: jest.fn(() => ({})),
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

describe("GET /movies/:id/reviews", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait lister les avis d'un film", async () => {
    mockReviewRepo.getReviewsByFilmId.mockResolvedValue([
      { id: "r1", rating: 8, comment: "Super" },
    ]);

    const res = await request(app).get("/movies/m1/reviews");

    expect(res.status).toBe(200);
    expect(res.body[0].rating).toBe(8);
  });
});

describe("POST /movies/:id/reviews", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait ajouter un avis", async () => {
    mockReviewRepo.getReviewByUserAndFilm.mockResolvedValue(null);
    mockReviewRepo.addReview.mockResolvedValue({
      id: "r2",
      rating: 9,
      comment: "Génial",
    });

    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 9, comment: "Génial" });

    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(9);
  });

  it("devrait refuser une note > 10", async () => {
    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 15 });

    expect(res.status).toBe(400);
  });

  it("devrait refuser une note < 1", async () => {
    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 0 });

    expect(res.status).toBe(400);
  });

  it("devrait refuser un double avis", async () => {
    mockReviewRepo.getReviewByUserAndFilm.mockResolvedValue({ id: "existing" });

    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 7 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Vous avez déjà noté ce film");
  });

  it("devrait ajouter un avis sans commentaire", async () => {
    mockReviewRepo.getReviewByUserAndFilm.mockResolvedValue(null);
    mockReviewRepo.addReview.mockResolvedValue({
      id: "r3",
      rating: 7,
      comment: null,
    });

    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 7 });

    expect(res.status).toBe(201);
    expect(res.body.comment).toBeNull();
  });
});

describe("PUT /reviews/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait modifier un avis", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue({
      id: "r1",
      userId: "uuid-1",
    });
    mockReviewRepo.updateReview.mockResolvedValue({ id: "r1", rating: 10 });

    const res = await request(app)
      .put("/reviews/r1")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 10 });

    expect(res.status).toBe(200);
  });

  it("devrait retourner 403 si pas le propriétaire", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue({
      id: "r1",
      userId: "autre-user",
    });

    const res = await request(app)
      .put("/reviews/r1")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5 });

    expect(res.status).toBe(403);
  });

  it("devrait retourner 404 si avis non trouvé", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue(null);

    const res = await request(app)
      .put("/reviews/r1")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5 });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /reviews/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait supprimer un avis", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue({
      id: "r1",
      userId: "uuid-1",
    });
    mockReviewRepo.deleteReview.mockResolvedValue(undefined);

    const res = await request(app)
      .delete("/reviews/r1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("devrait retourner 403 si pas le propriétaire", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue({
      id: "r1",
      userId: "autre-user",
    });

    const res = await request(app)
      .delete("/reviews/r1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("GET /movies/:id/reviews - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockReviewRepo.getReviewsByFilmId.mockRejectedValue(new Error("DB down"));

    const res = await request(app).get("/movies/m1/reviews");

    expect(res.status).toBe(500);
  });
});

describe("POST /movies/:id/reviews - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockReviewRepo.getReviewByUserAndFilm.mockRejectedValue(
      new Error("DB down"),
    );

    const res = await request(app)
      .post("/movies/m1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 8 });

    expect(res.status).toBe(500);
  });
});

describe("PUT /reviews/:id - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockReviewRepo.getReviewById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/reviews/r1")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5 });

    expect(res.status).toBe(500);
  });
});

describe("DELETE /reviews/:id - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockReviewRepo.getReviewById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .delete("/reviews/r1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("DELETE /reviews/:id - avis non trouvé", () => {
  it("devrait retourner 404", async () => {
    mockReviewRepo.getReviewById.mockResolvedValue(null);

    const res = await request(app)
      .delete("/reviews/r1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
