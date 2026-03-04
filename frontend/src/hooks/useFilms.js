import { useQuery } from "@tanstack/react-query";

const API_KEY = "bbea3217";

import { useQuery } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

const API_KEY = "bbea3217";

const fetchFilm = async (id) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
  );

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
};

export const useFilm = (id) => {
  return useQuery({
    queryKey: ["film", id],
    queryFn: () => fetchFilm(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};