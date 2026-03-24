import { useRef, useEffect } from "react";

export default function ChatArea({
  selectedFriend,
  selectedFriendName,
  isConnected,
  messages,
  currentUserId,
  isTyping,
  input,
  onTyping,
  onKeyDown,
  onSend,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{selectedFriendName}</h1>
          <p className="text-sm text-zinc-400">
            {selectedFriend ? "Chat en temps réel" : "Sélectionnez un ami"}
          </p>
        </div>
        <div className="text-sm">
          {isConnected ? (
            <span className="text-green-400">● En ligne</span>
          ) : (
            <span className="text-red-400">● Déconnecté</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {!selectedFriend && (
          <p className="text-zinc-500 text-center mt-20">
            Sélectionnez un ami pour commencer à discuter
          </p>
        )}
        {messages.map((message) => {
          const isMe = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  isMe ? "bg-white text-black" : "bg-zinc-800 text-white"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(message.sentAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="text-zinc-500 text-sm italic">
            En train d'écrire...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 px-6 py-4 flex gap-3">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={onTyping}
          onKeyDown={onKeyDown}
          disabled={!selectedFriend}
          className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none border border-zinc-700 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!selectedFriend}
          className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
