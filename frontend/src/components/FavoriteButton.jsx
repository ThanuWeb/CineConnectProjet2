import { useFavorite } from "../hooks/useFavorite";

export default function FavoriteButton({ filmId }) {
  const { favorite, loading, toggleFavorite } = useFavorite(filmId);

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        favorite
          ? "bg-red-500 text-white"
          : "bg-zinc-800 text-white hover:bg-zinc-700"
      }`}
    >
      {favorite ? "❤️ Favori" : "🤍 Ajouter aux favoris"}
    </button>
  );
}
