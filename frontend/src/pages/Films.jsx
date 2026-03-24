import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFilms, useSearchFilms } from "../hooks/useFilms";
import FilmCard from "../components/FilmCard";
import SearchBar from "../components/SearchBar";

export default function Films() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [director, setDirector] = useState("");

  const { data: allFilms, isLoading: loadingAll, error: errorAll } = useFilms();
  const {
    data: searchResults,
    isLoading: loadingSearch,
    error: errorSearch,
  } = useSearchFilms(search);
  const isSearching = search.length >= 2;
  const data = isSearching ? (searchResults ?? []) : (allFilms ?? []);
  const isLoading = isSearching ? loadingSearch : loadingAll;
  const error = isSearching ? errorSearch : errorAll;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(input);
    }, 400);

    return () => clearTimeout(timeout);
  }, [input]);

  const filteredFilms = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((film) => {
      const yearMatch = year ? film.year === Number(year) : true;
      const directorMatch = director
        ? film.director?.toLowerCase().includes(director.toLowerCase())
        : true;
      return yearMatch && directorMatch;
    });
  }, [data, year, director]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-20 py-6">
        <h1 className="text-2xl font-bold">cineconnect</h1>

        <div className="flex gap-8 text-zinc-300 items-center">
          <span>Séries</span>
          <span className="text-white">Films</span>
          <span>Documentaires</span>
          <span>FAQ</span>
          <span>Aide</span>

          <Link to="/users" className="hover:text-white transition">
            Utilisateurs
          </Link>

          <Link to="/discussion" className="hover:text-white transition">
            Discussion
          </Link>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <button className="bg-zinc-800 px-4 py-2 rounded">
              S’identifier
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-white text-black px-4 py-2 rounded">
              S’inscrire
            </button>
          </Link>
        </div>
      </nav>

      {/* FILTRES CENTRÉS */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-wrap gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600"
          >
            <option value="">Catégorie</option>
            <option value="Action">Action</option>
            <option value="Drama">Drame</option>
            <option value="Sci-Fi">Science-fiction</option>
            <option value="Comedy">Comédie</option>
            <option value="Adventure">Aventure</option>
            <option value="Fantasy">Fantastique</option>
            <option value="Crime">Crime</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horreur</option>
            <option value="Romance">Romance</option>
            <option value="Animation">Animation</option>
            <option value="Mystery">Mystère</option>
          </select>

          <input
            type="number"
            placeholder="Année"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 w-24"
          />

          <input
            type="number"
            placeholder="Note"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 w-20"
          />

          <input
            type="text"
            placeholder="Réalisateur"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 w-32"
          />
        </div>
      </div>

      {/* HERO */}
      <section className="mt-10 mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-6 leading-relaxed max-w-3xl mx-auto">
          Regardez, chattez et profitez avec vos amis en temps réel même à
          distance
          <br />
          temps réel même à distance
        </h2>

        <p className="text-zinc-400 mb-10 max-w-md mx-auto">
          Profitez de nouvelles offres et restez informé des nouveautés
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar value={input} onChange={setInput} />
          </div>
        </div>
      </section>

      {/* FILMS */}
      <section className="px-20 pb-24">
        <h3 className="text-xl font-semibold mb-10">Films</h3>

        {isLoading && <p className="text-zinc-400">Chargement…</p>}
        {error && <p className="text-red-400">Erreur : {error.message}</p>}

        {!isLoading && !error && filteredFilms.length > 0 && (
          <div className="grid grid-cols-5 gap-10">
            {filteredFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredFilms.length === 0 && (
          <p className="text-zinc-400">Aucun film trouvé avec ces filtres.</p>
        )}
      </section>
    </div>
  );
}
