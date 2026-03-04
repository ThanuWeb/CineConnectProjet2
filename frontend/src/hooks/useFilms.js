import { useQuery } from "@tanstack/react-query";

const API_KEY = "bbea3217";

const fetchFilms = async (search = "batman") => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&type=movie`
  );

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
};

export const useFilms = (search) => {
  return useQuery({
    queryKey: ["films", search],
    queryFn: () => fetchFilms(search),
    staleTime: 1000 * 60 * 5,
  });
};