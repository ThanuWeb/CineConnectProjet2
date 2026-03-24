import request from "supertest";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockMsgRepo = {
  sendMessage: jest.fn(),
  getConversation: jest.fn(),
  markAsRead: jest.fn(),
};

jest.mock("../Infrastructure/Repository/MessageRepository", () => ({
  MessageRepository: jest.fn(() => mockMsgRepo),
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
jest.mock("../Infrastructure/Repository/ReviewRepository", () => ({
  ReviewRepository: jest.fn(() => ({})),
}));
jest.mock("../Infrastructure/Repository/FriendRepository", () => ({
  FriendRepository: jest.fn(() => ({})),
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

describe("POST /messages", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait envoyer un message", async () => {
    mockMsgRepo.sendMessage.mockResolvedValue({
      id: "msg-1",
      senderId: "uuid-1",
      receiverId: "uuid-2",
      content: "Salut",
      sentAt: new Date(),
      isRead: false,
    });

    const res = await request(app)
      .post("/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ receiverId: "uuid-2", content: "Salut" });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("Salut");
  });

  it("devrait retourner 400 sans content", async () => {
    const res = await request(app)
      .post("/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ receiverId: "uuid-2" });

    expect(res.status).toBe(400);
  });

  it("devrait retourner 400 sans receiverId", async () => {
    const res = await request(app)
      .post("/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Hello" });

    expect(res.status).toBe(400);
  });
});

describe("GET /messages/:userId", () => {
  it("devrait retourner la conversation", async () => {
    mockMsgRepo.getConversation.mockResolvedValue([
      { id: "msg-1", content: "Salut" },
      { id: "msg-2", content: "Hello" },
    ]);

    const res = await request(app)
      .get("/messages/uuid-2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("PUT /messages/:id/read", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait marquer un message comme lu", async () => {
    mockMsgRepo.markAsRead.mockResolvedValue({ id: "msg-1", isRead: true });

    const res = await request(app)
      .put("/messages/msg-1/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isRead).toBe(true);
  });

  it("devrait retourner 404 si message non trouvé", async () => {
    mockMsgRepo.markAsRead.mockResolvedValue(null);

    const res = await request(app)
      .put("/messages/unknown/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("POST /messages - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockMsgRepo.sendMessage.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ receiverId: "uuid-2", content: "Salut" });

    expect(res.status).toBe(500);
  });
});

describe("GET /messages/:userId - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockMsgRepo.getConversation.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/messages/uuid-2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("PUT /messages/:id/read - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockMsgRepo.markAsRead.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/messages/msg-1/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});
