import { useEffect, useState } from "react";
import { currentUser } from "../mock/currentUser";
import { getRatingByFilm, saveRating } from "../api/ratings";

export default function RatingStars({ imdbID }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const existing = getRatingByFilm(imdbID, currentUser.id);
    if (existing) {
      setRating(existing.value);
    }
  }, [imdbID]);

  const handleRate = (value) => {
    setRating(value);
    saveRating(imdbID, currentUser.id, value);
  };

  return (
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className={`text-2xl ${
            star <= rating ? "text-yellow-400" : "text-zinc-500"
          }`}
        >
          ★
        </button>
      ))}
      <span className="text-sm text-zinc-400 ml-2">
        {rating > 0 ? `${rating}/5` : "Pas encore noté"}
      </span>
    </div>
  );
}