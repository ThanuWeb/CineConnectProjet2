import { useParams, Link } from "@tanstack/react-router";
import { useUser } from "../hooks/useUser.js";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import EditProfileModal from "../components/EditProfileModal";
import EditPreferencesModal from "../components/EditPreferencesModal";
import { useUserStats } from "../hooks/useUserStats";

export default function Profile() {
  const { id } = useParams({ from: "/profile/$id" });
  const { data: user, isLoading } = useUser(id);
  const { data: stats, isLoading: statsLoading } = useUserStats(id);
  const [isFriend, setIsFriend] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [showEditPref, setShowEditPref] = useState(false);
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    apiFetch("/me").then((me) => setCurrentUserId(me.id));
  }, []);

  useEffect(() => {
    if (user && user.preferences !== undefined) {
      setPreferences(user.preferences || "");
    }
  }, [user]);

  async function handleAddFriend() {
    setAddMessage("");
    try {
      await apiFetch("/friends/request", {
        method: "POST",
        body: JSON.stringify({ addresseeId: id }),
      });
      setIsFriend(true);
      setAddMessage("Demande d'ami envoyée !");
    } catch (err) {
      setAddMessage("Erreur lors de l'ajout : " + (err.message || ""));
    }
  }

  if (isLoading) return <div className="text-white">Chargement…</div>;
  if (!user) return <div className="text-white">Utilisateur introuvable.</div>;

  const isMyProfile = currentUserId === id;
  console.log(user.avatarUrl);
  return (
    <div className="min-h-screen bg-black text-white px-20 py-10">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/users"
          className="inline-block mb-6 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
        >
          ← Retour aux utilisateurs
        </Link>

        <h1 className="text-3xl font-bold mb-8">Profil utilisateur</h1>

        <div className="grid grid-cols-[220px_1fr] gap-10">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
            <div
              className="w-28 h-28 rounded-full
             mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.username?.[0]?.toUpperCase()
              )}
            </div>

            <h2 className="text-xl font-semibold text-center">
              {user.username}
            </h2>
            <p className="text-zinc-400 text-center mt-1">{user.email}</p>

            {!isMyProfile && (
              <>
                <button
                  onClick={handleAddFriend}
                  disabled={isFriend}
                  className={`w-full mt-6 py-2 rounded-lg font-medium transition ${
                    isFriend
                      ? "bg-green-500 text-white"
                      : "bg-white text-black hover:opacity-90"
                  }`}
                >
                  {isFriend ? "Demande envoyée ✔" : "Ajouter en ami"}
                </button>
                {addMessage && (
                  <p className="text-center text-sm mt-2 text-zinc-400">
                    {addMessage}
                  </p>
                )}
              </>
            )}

            {isMyProfile && (
              <button
                onClick={() => setShowEdit(true)}
                className="w-full mt-6 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Éditer le profil
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Informations</h3>
              <div className="space-y-3 text-zinc-300">
                <p>
                  <span className="text-white font-medium">Nom :</span>{" "}
                  {user.username}
                </p>
                <p>
                  <span className="text-white font-medium">Email :</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="text-white font-medium">Bio :</span>{" "}
                  {user.bio || "—"}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Préférences cinéma</h3>
                {isMyProfile && (
                  <button
                    onClick={() => setShowEditPref(true)}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    Modifier
                  </button>
                )}
              </div>
              <p className="text-zinc-300 whitespace-pre-line">
                {preferences || "Aucune préférence renseignée."}
              </p>
            </div>
            {showEditPref && (
              <EditPreferencesModal
                preferences={preferences}
                onClose={() => setShowEditPref(false)}
                onSave={(val) => setPreferences(val)}
              />
            )}

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : (stats?.favorites ?? 0)}
                  </p>
                  <p className="text-zinc-400 text-sm">Favoris</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : (stats?.reviews ?? 0)}
                  </p>
                  <p className="text-zinc-400 text-sm">Avis laissés</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : (stats?.friends ?? 0)}
                  </p>
                  <p className="text-zinc-400 text-sm">Amis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showEdit && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEdit(false)}
            onSave={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
}
