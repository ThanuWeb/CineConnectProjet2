import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useSocket } from "../hooks/useSocket";
import { apiFetch } from "../api";
import FriendsSidebar from "../components/discussion/FriendsSideBar";
import ChatArea from "../components/discussion/ChatArea";
import AddFriendModal from "../components/discussion/AddFriendModal";
import PendingRequestsModal from "../components/discussion/PendingRequestsModal";

export default function Discussion() {
  const { userId } = useSearch({ strict: false });
  const { socket, isConnected } = useSocket();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const typingTimeout = useRef(null);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addMessage, setAddMessage] = useState("");
  const [searching, setSearching] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    apiFetch("/me")
      .then((user) => setCurrentUserId(user.id))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    loadFriends();
  }, [currentUserId]);

  async function loadFriends() {
    try {
      const friendsList = await apiFetch("/friends");
      const users = await apiFetch("/users");
      const enriched = friendsList.map((f) => {
        const friendId =
          f.requesterId === currentUserId ? f.addresseeId : f.requesterId;
        const user = users.find((u) => u.id === friendId);
        return {
          ...f,
          friendId,
          friendName: user?.username || "Utilisateur",
        };
      });
      setFriends(enriched);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!currentUserId) return;
    loadPending();
  }, [currentUserId]);

  async function loadPending() {
    try {
      const pending = await apiFetch("/friends/pending");
      const users = await apiFetch("/users");
      const enriched = pending.map((p) => {
        const user = users.find((u) => u.id === p.requesterId);
        return { ...p, requesterName: user?.username || "Utilisateur" };
      });
      setPendingRequests(enriched);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAcceptFriend(id) {
    try {
      await apiFetch(`/friends/${id}/accept`, { method: "PUT" });
      setPendingRequests((prev) => prev.filter((p) => p.id !== id));
      loadFriends();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRejectFriend(id) {
    try {
      await apiFetch(`/friends/${id}/reject`, { method: "PUT" });
      setPendingRequests((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFriendSearch() {
    if (!friendSearch.trim()) return;
    setSearching(true);
    setAddMessage("");
    try {
      const users = await apiFetch("/users");
      const results = users.filter(
        (u) =>
          u.id !== currentUserId &&
          u.username.toLowerCase().includes(friendSearch.toLowerCase()),
      );
      setSearchResults(results);
      if (results.length === 0) setAddMessage("Aucun utilisateur trouvé");
    } catch {
      setAddMessage("Erreur lors de la recherche");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddFriend(addresseeId) {
    setAddMessage("");
    try {
      await apiFetch("/friends/request", {
        method: "POST",
        body: JSON.stringify({ addresseeId }),
      });
      setAddMessage("Demande d'ami envoyée !");
      setSearchResults((prev) => prev.filter((u) => u.id !== addresseeId));
    } catch (err) {
      setAddMessage(err.message);
    }
  }

  useEffect(() => {
    if (!selectedFriend) return;
    apiFetch(`/messages/${selectedFriend}`)
      .then(setMessages)
      .catch(console.error);
  }, [selectedFriend]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      if (message.senderId === selectedFriend) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleSent = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message:receive", handleReceive);
    socket.on("message:sent", handleSent);
    socket.on(
      "typing:start",
      (id) => id === selectedFriend && setIsTyping(true),
    );
    socket.on(
      "typing:stop",
      (id) => id === selectedFriend && setIsTyping(false),
    );

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("message:sent", handleSent);
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, selectedFriend]);

  function handleSend() {
    if (!input.trim() || !socket || !selectedFriend) return;
    socket.emit("message:send", {
      receiverId: selectedFriend,
      content: input.trim(),
    });
    setInput("");
    socket.emit("typing:stop", selectedFriend);
  }

  function handleTyping(e) {
    setInput(e.target.value);
    if (!socket || !selectedFriend) return;
    socket.emit("typing:start", selectedFriend);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", selectedFriend);
    }, 1000);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  const selectedFriendName =
    friends.find((f) => f.friendId === selectedFriend)?.friendName ||
    "Discussion";

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <Link
        to="/"
        className="inline-block mb-6 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
      >
        ← Retour aux films
      </Link>

      <div className="max-w-5xl mx-auto h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden flex">
        <FriendsSidebar
          friends={friends}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          pendingRequests={pendingRequests}
          setShowPending={setShowPending}
          setShowAddFriend={setShowAddFriend}
          setFriendSearch={setFriendSearch}
          setSearchResults={setSearchResults}
          setAddMessage={setAddMessage}
        />

        <ChatArea
          selectedFriend={selectedFriend}
          selectedFriendName={selectedFriendName}
          isConnected={isConnected}
          messages={messages}
          currentUserId={currentUserId}
          isTyping={isTyping}
          input={input}
          onTyping={handleTyping}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
        />
      </div>

      {showAddFriend && (
        <AddFriendModal
          friendSearch={friendSearch}
          setFriendSearch={setFriendSearch}
          searching={searching}
          searchResults={searchResults}
          addMessage={addMessage}
          onSearch={handleFriendSearch}
          onAdd={handleAddFriend}
          onClose={() => setShowAddFriend(false)}
        />
      )}

      {showPending && (
        <PendingRequestsModal
          pendingRequests={pendingRequests}
          onAccept={handleAcceptFriend}
          onReject={handleRejectFriend}
          onClose={() => setShowPending(false)}
        />
      )}
    </div>
  );
}
