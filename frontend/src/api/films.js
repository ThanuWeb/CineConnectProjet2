const API_KEY = "bbea3217";

export async function fetchFilmById(id) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
  );

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
}

export async function fetchFilms(search, year = "") {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}${
      year ? `&y=${year}` : ""
    }`
  );

  const data = await response.json();

  if (data.Response === "False") {
    if (data.Error === "Movie not found!") {
      return {
        Search: [],
        totalResults: "0",
        Response: "True",
      };
    }

    throw new Error(data.Error);
  }

  const detailedFilms = await Promise.all(
    data.Search.map((film) => fetchFilmById(film.imdbID))
  );

  return {
    ...data,
    Search: detailedFilms,
  };
}