import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { apiFetch } from "../api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Recherche dynamique avec debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await apiFetch(
          `/movies/search?q=${encodeURIComponent(query.trim())}`,
        );
        setSuggestions(results.slice(0, 6));
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate({ to: "/film", search: { q: query.trim() } });
      setQuery("");
    }
  }

  function handleSelectMovie(movie) {
    setShowDropdown(false);
    setQuery("");
    navigate({ to: `/film/${movie.id}` });
  }

  return (
    <div className="navBar p-4 bg-black text-white">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl">CineConnect</span>

        <div className="hidden md:block relative" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              className="px-3 py-1 rounded-lg border border-gray-500 text-black w-64"
            />
            <button
              type="submit"
              className="bg-white text-black px-3 py-1 rounded-lg font-semibold"
            >
              Rechercher
            </button>
          </form>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {suggestions.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                >
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-300 rounded" />
                  )}
                  <div>
                    <p className="text-black text-sm font-medium">
                      {movie.title}
                    </p>
                    {movie.year && (
                      <p className="text-gray-500 text-xs">{movie.year}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ul className="hidden md:flex list-none gap-8 text-white">
          <Link to="/film"><li>Films</li></Link>
          <Link to="/documentaries"><li>Documentaires</li></Link>
          <Link to="/faq"><li>FAQ</li></Link>
          <Link to="/help"><li>Aides</li></Link>
        </ul>

        <div className="hidden md:flex gap-2">
          <Link to="/login">
            <button className="bg-white text-black p-2 rounded border-2">
              S'identifier
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-white text-black p-2 rounded border-2">
              S'inscrire
            </button>
          </Link>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 text-white transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#1f2937", zIndex: 1000 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="font-bold text-lg">Menu</span>
          <button className="text-2xl" onClick={() => setMenuOpen(false)}>
            {" "}
            ✕{" "}
          </button>
        </div>
        <ul className="flex flex-col gap-6 p-6">
          <Link to="/film"><li className="hover:text-gray-300 cursor-pointer">Films</li></Link>
          <Link to="/documentaries"><li className="hover:text-gray-300 cursor-pointer">Documentaires</li></Link>
          <Link to="/faq"><li className="hover:text-gray-300 cursor-pointer">FAQ</li></Link>
          <Link to="/help"><li className="hover:text-gray-300 cursor-pointer">Aides</li></Link>
        </ul>
        <div className="flex flex-col gap-3 p-6">
          <Link to="/login">
            <button className="bg-gray-700 text-white p-2 rounded border-2 w-full hover:bg-gray-600">
              S'identifier
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-gray-700 text-white p-2 rounded border-2 w-full hover:bg-gray-600">
              S'inscrire
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
