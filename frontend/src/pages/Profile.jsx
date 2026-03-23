import { Link } from "@tanstack/react-router";

export default function Profile() {
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
            <div className="w-28 h-28 rounded-full bg-zinc-700 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
              A
            </div>

            <h2 className="text-xl font-semibold text-center">Alice</h2>
            <p className="text-zinc-400 text-center mt-1">
              alice@email.com
            </p>

            <button className="w-full mt-6 bg-white text-black py-2 rounded-lg font-medium hover:opacity-90 transition">
              Ajouter en ami
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Informations</h3>

              <div className="space-y-3 text-zinc-300">
                <p>
                  <span className="text-white font-medium">Nom :</span> Alice
                </p>
                <p>
                  <span className="text-white font-medium">Email :</span>{" "}
                  alice@email.com
                </p>
                <p>
                  <span className="text-white font-medium">Bio :</span>{" "}
                  Passionnée de thrillers et de science-fiction.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Préférences cinéma
              </h3>

              <div className="flex flex-wrap gap-3">
                <span className="bg-zinc-800 px-4 py-2 rounded-full">
                  Thriller
                </span>
                <span className="bg-zinc-800 px-4 py-2 rounded-full">
                  Science-fiction
                </span>
                <span className="bg-zinc-800 px-4 py-2 rounded-full">
                  Drame
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Statistiques</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-zinc-400 text-sm">Films vus</p>
                </div>

                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-zinc-400 text-sm">Avis laissés</p>
                </div>

                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-zinc-400 text-sm">Amis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}