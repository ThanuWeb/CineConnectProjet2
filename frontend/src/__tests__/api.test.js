import { getToken, setToken, removeToken, apiFetch } from "../api";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

describe("Token helpers", () => {
  it("getToken retourne null par défaut", () => {
    expect(getToken()).toBeNull();
  });

  it("setToken stocke le token", () => {
    setToken("my-token");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "my-token");
  });

  it("removeToken supprime le token", () => {
    removeToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });
});

describe("apiFetch", () => {
  it("devrait faire un fetch avec le bon URL et headers", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: "test" }),
    });

    const result = await apiFetch("/movies");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/movies",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
    expect(result).toEqual({ data: "test" });
  });

  it("devrait inclure le token Authorization si présent", async () => {
    localStorageMock.setItem("token", "my-token");
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await apiFetch("/movies");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/movies",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-token",
        }),
      }),
    );
  });

  it("devrait ne pas inclure Authorization sans token", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await apiFetch("/movies");

    const callHeaders = fetch.mock.calls[0][1].headers;
    expect(callHeaders.Authorization).toBeUndefined();
  });

  it("devrait throw si la réponse n'est pas ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Non autorisé" }),
    });

    await expect(apiFetch("/movies")).rejects.toThrow("Non autorisé");
  });

  it("devrait throw 'Erreur serveur' si le body est invalide", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error();
      },
    });

    await expect(apiFetch("/movies")).rejects.toThrow("Erreur serveur");
  });

  it("devrait passer les options (method, body)", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: "abc" }),
    });

    await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "123" }),
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/login",
      expect.objectContaining({
        method: "POST",
        body: '{"email":"a@b.com","password":"123"}',
      }),
    );
  });
});
