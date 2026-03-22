import { useState } from "react";
import { Link } from "@tanstack/react-router";

const fakeMessages = [
  {
    id: 1,
    author: "Alice",
    content: "Tu as vu The Batman ?",
    mine: false,
  },
  {
    id: 2,
    author: "Moi",
    content: "Oui, j’ai beaucoup aimé l’ambiance du film.",
    mine: true,
  },
  {
    id: 3,
    author: "Alice",
    content: "Moi aussi, surtout la réalisation.",
    mine: false,
  },
];

export default function Discussion() {
  const [messages, setMessages] = useState(fakeMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      author: "Moi",
      content: input,
      mine: true,
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">

      {/* Bouton retour */}
      <Link
        to="/"
        className="inline-block mb-6 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
      >
        ← Retour aux films
      </Link>

      <div className="max-w-5xl mx-auto h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Discussion</h1>
            <p className="text-sm text-zinc-400">
              Chat en temps réel entre utilisateurs
            </p>
          </div>

          <div className="text-sm text-zinc-400">
            En ligne
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.mine
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {message.author}
                </p>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 px-6 py-4 flex gap-3">
          <input
            type="text"
            placeholder="Écrire un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none border border-zinc-700"
          />

          <button
            onClick={handleSend}
            className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Envoyer
          </button>
        </div>

      </div>
    </div>
  );
}