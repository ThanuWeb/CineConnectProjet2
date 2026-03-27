import { useEffect, useState } from "react";
import { currentUser } from "../mock/currentUser";
import {
  isFavorite,
  addFavorite,
  removeFavorite,
} from "../api/favorites";

export default function FavoriteButton({ imdbID }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(imdbID, currentUser.id));
  }, [imdbID]);

  const handleToggle = () => {
    if (favorite) {
      removeFavorite(imdbID, currentUser.id);
      setFavorite(false);
    } else {
      addFavorite(imdbID, currentUser.id);
      setFavorite(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
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