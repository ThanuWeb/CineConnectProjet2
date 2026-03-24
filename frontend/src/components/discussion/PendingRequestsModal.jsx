export default function PendingRequestsModal({
  pendingRequests,
  onAccept,
  onReject,
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
          <h2 className="text-lg font-semibold">Demandes d'ami</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-zinc-500 text-sm">Aucune demande en attente</p>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg"
              >
                <span>{req.requesterName}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-500 transition"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-500 transition"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
