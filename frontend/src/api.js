const API_URL = "http://localhost:3000";

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function removeTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    removeTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

export async function apiFetch(path, options = {}) {
  let token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Si 401/403, tenter un refresh et réessayer une fois
  if ((res.status === 401 || res.status === 403) && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryRes = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
      if (!retryRes.ok) {
        const error = await retryRes.json().catch(() => ({}));
        throw new Error(error.error || "Erreur serveur");
      }
      return retryRes.json();
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Erreur serveur");
  }
  return res.json();
}
