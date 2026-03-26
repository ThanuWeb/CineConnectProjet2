export default function FriendsSidebar({
  friends,
  selectedFriend,
  setSelectedFriend,
  pendingRequests,
  setShowPending,
  setShowAddFriend,
  setFriendSearch,
  setSearchResults,
  setAddMessage,
}) {
  return (
    <div className="w-64 border-r border-zinc-800 flex flex-col">
      <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="font-semibold">Amis</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPending(true)}
            className="relative text-lg hover:text-yellow-400 transition"
            title="Demandes en attente"
          >
            🔔
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setShowAddFriend(true);
              setFriendSearch("");
              setSearchResults([]);
              setAddMessage("");
            }}
            className="text-xl hover:text-green-400 transition"
            title="Ajouter un ami"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {friends.length === 0 && (
          <p className="text-zinc-500 text-sm p-4">Aucun ami pour le moment</p>
        )}
        {friends.map((f) => (
          <div
            key={f.id}
            onClick={() => setSelectedFriend(f.friendId)}
            className={`px-4 py-3 cursor-pointer hover:bg-zinc-800 transition ${
              selectedFriend === f.friendId ? "bg-zinc-800" : ""
            }`}
          >
            <p className="font-medium">{f.friendName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
