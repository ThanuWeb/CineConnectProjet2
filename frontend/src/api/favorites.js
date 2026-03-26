const STORAGE_KEY = "favorites";

export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function isFavorite(imdbID, userId) {
  const favorites = getFavorites();
  return favorites.some(
    (fav) => fav.imdbID === imdbID && fav.userId === userId
  );
}

export function addFavorite(imdbID, userId) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (fav) => fav.imdbID === imdbID && fav.userId === userId
  );

  if (!exists) {
    favorites.push({ imdbID, userId });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }

  return favorites;
}

export function removeFavorite(imdbID, userId) {
  const favorites = getFavorites().filter(
    (fav) => !(fav.imdbID === imdbID && fav.userId === userId)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return favorites;
}