import { useEffect, useState } from "react";
import { useReviews, useAddReview, useUpdateReview } from "../hooks/useReviews";
import { apiFetch } from "../api";

export default function CommentsSection({ filmId }) {
  const { data: reviews = [], isLoading } = useReviews(filmId);
  const addReview = useAddReview(filmId);
  const updateReviewMutation = useUpdateReview(filmId);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState();
  const [currentUserId, setCurrentUserId] = useState(null);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    apiFetch("/me")
      .then((me) => setCurrentUserId(me.id))
      .catch(() => setCurrentUserId(null));
  }, []);

  const userReview = reviews.find((r) => r.userId === currentUserId);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (userReview) {
      updateReviewMutation.mutate({
        reviewId: userReview.id,
        review: { rating, comment: input },
      });
    } else {
      addReview.mutate({ rating, comment: input });
    }
    setInput("");
    setRating();
  };

  useEffect(() => {
    if (!isLoading && userReview) {
      setInput(userReview.comment || "");
      setRating(userReview.rating);
    }
  }, [userReview?.id, isLoading]);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Commentaires</h3>
      <div className="flex gap-3 mb-6">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none border border-zinc-700"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-zinc-800 text-white px-2 py-1 rounded-xl border border-zinc-700"
        >
          <option value="">Note</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          {userReview ? "Mettre à jour" : "Publier"}
        </button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <p>Chargement…</p>
        ) : reviews.length === 0 ? (
          <p className="text-zinc-400">Aucun commentaire pour le moment.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3 items-start"
            >
              <img
                src={
                  review.avatarUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(review.username || "U")
                }
                alt={review.username || "Utilisateur"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-zinc-400 mb-1">
                  {review.username || "Utilisateur"} •{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white">{review.comment}</p>
                <p className="text-yellow-400">Note: {review.rating}/10</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
