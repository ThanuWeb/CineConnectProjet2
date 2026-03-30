jest.mock("../Infrastructure/Repository/UserRepository", () => ({
  UserRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/MovieRepository", () => ({
  MovieRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/CategoryRepository", () => ({
  CategoryRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/ReviewRepository", () => ({
  ReviewRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/FriendRepository", () => ({
  FriendRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/MessageRepository", () => ({
  MessageRepository: jest.fn(() => ({})),
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

import request from "supertest";
import { app } from "../app";

describe("GET /health", () => {
  it("devrait retourner { status: 'ok' }", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
