import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUsers } from "../hooks/useUsers";

export default function Users() {
  const { data: users = [], isLoading } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/films"
          className="inline-block mb-6 px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition"
        >
          ← Retour aux films
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Utilisateurs</h1>
          <p className="text-zinc-400">
            Recherchez d’autres cinéphiles et démarrez une discussion.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-zinc-900 text-white px-4 py-3 rounded-xl border border-zinc-700 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold">
                  {user.avatar}
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-zinc-400 mt-2">{user.bio}</p>

                  <div className="flex gap-3 mt-5">
                    <Link
                      to={`/profile/${user.id}`}
                      className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                    >
                      Voir profil
                    </Link>

                    <Link
                      to="/discussion"
                      className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
                    >
                      Discuter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <p className="text-zinc-400 mt-8">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
}
