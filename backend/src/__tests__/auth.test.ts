import request from "supertest";
import jwt from "jsonwebtoken";
import { AuthController } from "../Controllers/AuthController";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// --- Mocks ---
const mockUserRepo = {
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  addUser: jest.fn(),
  updateUser: jest.fn(),
  getAllUsers: jest.fn(),
};

jest.mock("../Infrastructure/Repository/UserRepository", () => ({
  UserRepository: jest.fn(() => mockUserRepo),
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

describe("POST /signup", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait créer un utilisateur et retourner 201", async () => {
    mockUserRepo.getUserByEmail.mockResolvedValue(null);
    mockUserRepo.addUser.mockResolvedValue({ id: "uuid-1" });

    const res = await request(app).post("/signup").send({
      username: "john",
      email: "john@test.com",
      password: "secret123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId", "uuid-1");
  });

  it("devrait retourner 400 si champs manquants", async () => {
    const res = await request(app)
      .post("/signup")
      .send({ email: "john@test.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Tous les champs sont requis");
  });

  it("devrait retourner 400 si email déjà utilisé", async () => {
    mockUserRepo.getUserByEmail.mockResolvedValue({ id: "existing" });

    const res = await request(app).post("/signup").send({
      username: "john",
      email: "john@test.com",
      password: "secret123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email déjà utilisé");
  });
});

describe("POST /login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait retourner un token JWT", async () => {
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash("secret123", 10);
    mockUserRepo.getUserByEmail.mockResolvedValue({
      id: "uuid-1",
      passwordHash: hash,
    });

    const res = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    const decoded = jwt.verify(res.body.token, "test-secret") as any;
    expect(decoded.userId).toBe("uuid-1");
  });

  it("devrait retourner 400 si email inconnu", async () => {
    mockUserRepo.getUserByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post("/login")
      .send({ email: "nope@test.com", password: "secret123" });

    expect(res.status).toBe(400);
  });

  it("devrait retourner 400 si mot de passe incorrect", async () => {
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash("autreMotDePasse", 10);
    mockUserRepo.getUserByEmail.mockResolvedValue({
      id: "uuid-1",
      passwordHash: hash,
    });

    const res = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "mauvais" });

    expect(res.status).toBe(400);
  });

  it("devrait retourner 400 sans email ou password", async () => {
    const res = await request(app).post("/login").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email et mot de passe requis");
  });
});

describe("GET /me", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devrait retourner 401 sans token", async () => {
    const res = await request(app).get("/me");
    expect(res.status).toBe(401);
  });

  it("devrait retourner le profil avec un token valide", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.getUserById.mockResolvedValue({
      id: "uuid-1",
      username: "john",
      email: "john@test.com",
      passwordHash: "hash",
      avatarUrl: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("john");
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("devrait retourner 403 avec un token invalide", async () => {
    const res = await request(app)
      .get("/me")
      .set("Authorization", "Bearer fake-token");

    expect(res.status).toBe(403);
  });
});

describe("PUT /me", () => {
  it("devrait mettre à jour le profil", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.updateUser.mockResolvedValue({
      id: "uuid-1",
      username: "johnny",
      email: "john@test.com",
      passwordHash: "hash",
      avatarUrl: null,
      bio: "Hello",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .put("/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "johnny", bio: "Hello" });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("johnny");
    expect(res.body).not.toHaveProperty("passwordHash");
  });
});

describe("POST /signup - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockUserRepo.getUserByEmail.mockRejectedValue(new Error("DB down"));

    const res = await request(app).post("/signup").send({
      username: "john",
      email: "john@test.com",
      password: "secret123",
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erreur serveur");
  });
});

describe("POST /login - erreur serveur", () => {
  it("devrait retourner 500 si le repo throw", async () => {
    mockUserRepo.getUserByEmail.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/login")
      .send({ email: "john@test.com", password: "secret123" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erreur serveur");
  });
});

describe("GET /me - cas limites", () => {
  it("devrait retourner 404 si utilisateur non trouvé", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.getUserById.mockResolvedValue(null);

    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Utilisateur non trouvé");
  });

  it("devrait retourner 500 si le repo throw", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.getUserById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
  });
});

describe("PUT /me - cas limites", () => {
  it("devrait retourner 404 si utilisateur non trouvé", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.updateUser.mockResolvedValue(null);

    const res = await request(app)
      .put("/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "new" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Utilisateur non trouvé");
  });

  it("devrait retourner 500 si le repo throw", async () => {
    const token = jwt.sign({ userId: "uuid-1" }, "test-secret", {
      expiresIn: "1h",
    });
    mockUserRepo.updateUser.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "new" });

    expect(res.status).toBe(500);
  });
});

describe("AuthController.getAllUsers", () => {
  it("devrait retourner la liste des utilisateurs", async () => {
    mockUserRepo.getAllUsers.mockResolvedValue([
      { id: "uuid-1", username: "john" },
    ]);

    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await AuthController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "uuid-1", username: "john" }]);
  });

  it("devrait retourner 500 si erreur", async () => {
    mockUserRepo.getAllUsers.mockRejectedValue(new Error("DB down"));

    const req = {} as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await AuthController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
