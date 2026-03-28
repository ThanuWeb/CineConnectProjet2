import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api";

export function useFavorite(filmId) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchFavorite() {
      try {
        const res = await apiFetch(`/favorites/${filmId}`);
        if (isMounted) setFavorite(res.isFavorite);
      } catch {
        if (isMounted) setFavorite(false);
      }
    }
    if (filmId) fetchFavorite();
    return () => {
      isMounted = false;
    };
  }, [filmId]);

  const toggleFavorite = useCallback(async () => {
    setLoading(true);
    try {
      if (favorite) {
        await apiFetch(`/favorites/${filmId}`, { method: "DELETE" });
        setFavorite(false);
      } else {
        await apiFetch("/favorites", {
          method: "POST",
          body: JSON.stringify({ filmId }),
        });
        setFavorite(true);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [favorite, filmId]);

  return { favorite, loading, toggleFavorite };
}
