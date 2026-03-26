import { useEffect, useState } from "react";
import { currentUser } from "../mock/currentUser";
import { addComment, getCommentsByFilm } from "../api/comments";

export default function CommentsSection({ imdbID }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setComments(getCommentsByFilm(imdbID));
  }, [imdbID]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    addComment(imdbID, currentUser.id, currentUser.username, input.trim());
    setComments(getCommentsByFilm(imdbID));
    setInput("");
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Commentaires</h3>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none border border-zinc-700"
        />

        <button
          onClick={handleSubmit}
          className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Publier
        </button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-zinc-400">Aucun commentaire pour le moment.</p>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <p className="text-sm text-zinc-400 mb-1">
              {comment.username} • {comment.createdAt}
            </p>
            <p className="text-white">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}