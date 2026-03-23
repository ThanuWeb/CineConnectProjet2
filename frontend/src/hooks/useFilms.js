import { useQuery } from "@tanstack/react-query";
import { fetchFilms } from "../api/films";

export function useFilms(search, year) {
  return useQuery({
    queryKey: ["films", search, year],
    queryFn: () => fetchFilms(search, year),
    enabled: !!search,
  });
}