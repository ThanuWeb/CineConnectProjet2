import { useQuery } from "@tanstack/react-query";
import { fetchFilmById } from "../api/films";

export function useFilm(id) {
  return useQuery({
    queryKey: ["film", id],
    queryFn: () => fetchFilmById(id),
    enabled: !!id,
  });
}