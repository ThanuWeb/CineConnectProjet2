const API_KEY = "bbea3217";

export async function fetchFilms(search, type = "", year = "") {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}${
      type ? `&type=${type}` : ""
    }${year ? `&y=${year}` : ""}`
  );

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
}

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