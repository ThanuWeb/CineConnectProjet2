import { getToken, setTokens, removeTokens, apiFetch } from "../api";

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

  it("setTokens stocke les tokens", () => {
    setTokens("my-access-token", "my-refresh-token");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "my-access-token",
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "my-refresh-token",
    );
  });

  it("removeTokens supprime les tokens", () => {
    removeTokens();
    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
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
    localStorageMock.setItem("accessToken", "my-access-token");
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await apiFetch("/movies");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/movies",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-access-token",
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

  it("devrait refresh et réessayer si 401", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    localStorageMock.setItem("refreshToken", "valid-refresh");

    fetch
      // 1er appel: /movies → 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid token" }),
      })
      // 2e appel: /refresh → 200
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-access-token" }),
      })
      // 3e appel: /movies retry → 200
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "refreshed" }),
      });

    const result = await apiFetch("/movies");

    expect(result).toEqual({ data: "refreshed" });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "new-access-token",
    );
  });

  it("devrait refresh et réessayer si 403", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    localStorageMock.setItem("refreshToken", "valid-refresh");

    fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Invalid token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-access-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "ok" }),
      });

    const result = await apiFetch("/movies");

    expect(result).toEqual({ data: "ok" });
  });

  it("devrait supprimer les tokens si le refresh échoue", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    localStorageMock.setItem("refreshToken", "bad-refresh");

    fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid token" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Refresh token invalide" }),
      });

    await expect(apiFetch("/movies")).rejects.toThrow("Invalid token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
  });

  it("devrait throw si le refresh réussit mais le retry échoue", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    localStorageMock.setItem("refreshToken", "valid-refresh");

    fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-access-token" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Forbidden" }),
      });

    await expect(apiFetch("/movies")).rejects.toThrow("Forbidden");
  });

  it("devrait throw si le retry échoue avec body invalide", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    localStorageMock.setItem("refreshToken", "valid-refresh");

    fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Invalid token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-access-token" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error();
        },
      });

    await expect(apiFetch("/movies")).rejects.toThrow("Erreur serveur");
  });

  it("devrait ne pas tenter de refresh sans token initial", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "No token" }),
    });

    await expect(apiFetch("/movies")).rejects.toThrow("No token");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("devrait ne pas refresh si pas de refreshToken en storage", async () => {
    localStorageMock.setItem("accessToken", "expired-token");
    // pas de refreshToken

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Invalid token" }),
    });

    await expect(apiFetch("/movies")).rejects.toThrow("Invalid token");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
