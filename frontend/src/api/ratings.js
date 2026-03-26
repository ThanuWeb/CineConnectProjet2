const STORAGE_KEY = "ratings";

export function getRatings() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getRatingByFilm(imdbID, userId) {
  const ratings = getRatings();
  return ratings.find(
    (rating) => rating.imdbID === imdbID && rating.userId === userId
  );
}

export function saveRating(imdbID, userId, value) {
  const ratings = getRatings();

  const existingIndex = ratings.findIndex(
    (rating) => rating.imdbID === imdbID && rating.userId === userId
  );

  if (existingIndex !== -1) {
    ratings[existingIndex].value = value;
  } else {
    ratings.push({ imdbID, userId, value });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  return ratings;
}