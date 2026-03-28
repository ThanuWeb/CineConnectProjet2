import { useState } from "react";
import { apiFetch } from "../api";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await apiFetch("/me", {
        method: "PUT",
        body: JSON.stringify({ username, bio, avatarUrl }),
      });
      setSuccess(true);
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Éditer le profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-300 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            />
          </div>
          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">Profil mis à jour !</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-700 text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
