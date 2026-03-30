import { useState } from "react";
import { apiFetch } from "../api";

export default function EditPreferencesModal({ preferences, onClose, onSave }) {
  const [value, setValue] = useState(preferences || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/me", {
        method: "PUT",
        body: JSON.stringify({ preferences: value }),
      });
      if (onSave) onSave(value);
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
        <h2 className="text-2xl font-bold mb-6 text-white">
          Éditer les préférences cinéma
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            rows={5}
            placeholder="Décris tes goûts, genres ou réalisateurs préférés..."
          />
          {error && <p className="text-red-400">{error}</p>}
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
