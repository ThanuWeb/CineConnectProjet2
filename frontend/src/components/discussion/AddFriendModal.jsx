export default function AddFriendModal({
  friendSearch,
  setFriendSearch,
  searching,
  searchResults,
  addMessage,
  onSearch,
  onAdd,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Ajouter un ami</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur..."
            value={friendSearch}
            onChange={(e) => setFriendSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-600 outline-none"
          />
          <button
            onClick={onSearch}
            disabled={searching}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Rechercher
          </button>
        </div>

        {addMessage && (
          <p
            className={`text-sm mb-3 ${addMessage.includes("envoyée") ? "text-green-400" : "text-zinc-400"}`}
          >
            {addMessage}
          </p>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg"
            >
              <span>{user.username}</span>
              <button
                onClick={() => onAdd(user.id)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-500 transition"
              >
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
