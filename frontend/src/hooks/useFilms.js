import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";

const fetchMovies = async () => {
  return apiFetch("/movies");
};

export const useFilms = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    staleTime: 1000 * 60 * 10,
  });
};

const fetchFilm = async (id) => {
  return apiFetch(`/movies/${id}`);
};

export const useFilm = (id) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchFilm(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useSearchFilms = (query) => {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => apiFetch(`/movies/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
};
