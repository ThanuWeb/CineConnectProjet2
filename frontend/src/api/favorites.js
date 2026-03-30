import { apiFetch } from "../api";

export function addFavorite(filmId) {
  return apiFetch("/favorites", {
    method: "POST",
    body: JSON.stringify({ filmId }),
  });
}
