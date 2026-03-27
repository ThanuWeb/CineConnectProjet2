import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../api/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/"; // retour accueil
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-black text-white">

      {/* LOGO */}
      <Link to="/" className="text-lg font-bold">
        cineconnect
      </Link>

      {/* MENU */}
      <div className="flex gap-6 text-sm text-zinc-300">
        <Link to="/" className="hover:text-white">Accueil</Link>
        <Link to="/film" className="hover:text-white">Films</Link>
        <Link to="/utilisateurs" className="hover:text-white">Utilisateurs</Link>
        <Link to="/discussion" className="hover:text-white">Discussion</Link>
        <Link to="/faq" className="hover:text-white">FAQ</Link>
      </div>

      {/* DROITE (AUTH) */}
      <div className="flex items-center gap-4">

        {!user ? (
          <>
            <Link
              to="/login"
              className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700"
            >
              S'identifier
            </Link>

            <Link
              to="/register"
              className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200"
            >
              S'inscrire
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-zinc-400">
              Bonjour {user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}