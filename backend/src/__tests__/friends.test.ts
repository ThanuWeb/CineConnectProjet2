import request from "supertest";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockFriendRepo = {
  sendRequest: jest.fn(),
  getRequestById: jest.fn(),
  updateStatus: jest.fn(),
  getFriendsByUserId: jest.fn(),
  getPendingRequests: jest.fn(),
  deleteFriend: jest.fn(),
};

jest.mock("../Infrastructure/Repository/FriendRepository", () => ({
  FriendRepository: jest.fn(() => mockFriendRepo),
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

process.env.JWT_SECRET = "test-secret";

import { app } from "../app";

const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
  expiresIn: "1h",
});

describe("POST /friends/request", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait envoyer une demande d'ami", async () => {
    mockFriendRepo.sendRequest.mockResolvedValue({
      id: "f1",
      requesterId: "uuid-1",
      addresseeId: "uuid-2",
      status: "pending",
    });

    const res = await request(app)
      .post("/friends/request")
      .set("Authorization", `Bearer ${token}`)
      .send({ addresseeId: "uuid-2" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
  });

  it("devrait refuser l'auto-ajout", async () => {
    const res = await request(app)
      .post("/friends/request")
      .set("Authorization", `Bearer ${token}`)
      .send({ addresseeId: "uuid-1" });

    expect(res.status).toBe(400);
  });

  it("devrait retourner 400 sans addresseeId", async () => {
    const res = await request(app)
      .post("/friends/request")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /friends/:id/accept", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait accepter une demande", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      addresseeId: "uuid-1",
    });
    mockFriendRepo.updateStatus.mockResolvedValue({
      id: "f1",
      status: "accepted",
    });

    const res = await request(app)
      .put("/friends/f1/accept")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("accepted");
  });

  it("devrait retourner 403 si pas le destinataire", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      addresseeId: "autre-user",
    });

    const res = await request(app)
      .put("/friends/f1/accept")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("devrait retourner 404 si demande non trouvée", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue(null);

    const res = await request(app)
      .put("/friends/f1/accept")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("PUT /friends/:id/reject", () => {
  it("devrait rejeter une demande", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      addresseeId: "uuid-1",
    });
    mockFriendRepo.updateStatus.mockResolvedValue({
      id: "f1",
      status: "rejected",
    });

    const res = await request(app)
      .put("/friends/f1/reject")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("rejected");
  });
});

describe("GET /friends", () => {
  it("devrait lister les amis", async () => {
    mockFriendRepo.getFriendsByUserId.mockResolvedValue([
      { id: "f1", status: "accepted" },
    ]);

    const res = await request(app)
      .get("/friends")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("GET /friends/pending", () => {
  it("devrait lister les demandes en attente", async () => {
    mockFriendRepo.getPendingRequests.mockResolvedValue([
      { id: "f2", status: "pending" },
    ]);

    const res = await request(app)
      .get("/friends/pending")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].status).toBe("pending");
  });
});

describe("DELETE /friends/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait supprimer un ami", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      requesterId: "uuid-1",
      addresseeId: "uuid-2",
    });
    mockFriendRepo.deleteFriend.mockResolvedValue(undefined);

    const res = await request(app)
      .delete("/friends/f1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("devrait retourner 403 si pas impliqué", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      requesterId: "autre1",
      addresseeId: "autre2",
    });

    const res = await request(app)
      .delete("/friends/f1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("PUT /friends/:id/reject - cas limites", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait retourner 404 si demande non trouvée", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue(null);

    const res = await request(app)
      .put("/friends/f1/reject")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("devrait retourner 403 si pas le destinataire", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue({
      id: "f1",
      addresseeId: "autre-user",
    });

    const res = await request(app)
      .put("/friends/f1/reject")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe("DELETE /friends/:id - non trouvé", () => {
  it("devrait retourner 404 si relation non trouvée", async () => {
    mockFriendRepo.getRequestById.mockResolvedValue(null);

    const res = await request(app)
      .delete("/friends/f1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("POST /friends/request - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.sendRequest.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/friends/request")
      .set("Authorization", `Bearer ${token}`)
      .send({ addresseeId: "uuid-2" });

    expect(res.status).toBe(500);
  });
});

describe("PUT /friends/:id/accept - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.getRequestById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/friends/f1/accept")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("PUT /friends/:id/reject - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.getRequestById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/friends/f1/reject")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("GET /friends - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.getFriendsByUserId.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/friends")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("GET /friends/pending - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.getPendingRequests.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/friends/pending")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("DELETE /friends/:id - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockFriendRepo.getRequestById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .delete("/friends/f1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});
