import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFilms } from "../hooks/useFilms";
import FilmCard from "../components/FilmCard";
import SearchBar from "../components/SearchBar";

export default function Films() {
  const [input, setInput] = useState("batman");
  const [search, setSearch] = useState("batman");

  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [director, setDirector] = useState("");

  const { data, isLoading, error } = useFilms(search, year);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(input);
    }, 400);

    return () => clearTimeout(timeout);
  }, [input]);

  const filteredFilms = useMemo(() => {
    if (!data?.Search) return [];

    return data.Search.filter((film) => {
      const genreMatch = category
        ? film.Genre?.toLowerCase().includes(category.toLowerCase())
        : true;

      const directorMatch = director
        ? film.Director?.toLowerCase().includes(director.toLowerCase())
        : true;

      const ratingMatch = minRating
        ? Number(film.imdbRating) >= Number(minRating)
        : true;

      return genreMatch && directorMatch && ratingMatch;
    });
  }, [data, category, director, minRating]);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-20 py-6">
        <h1 className="text-2xl font-bold">cineconnect</h1>

        <div className="flex gap-10 text-zinc-300">
          <span>Séries</span>
          <span className="text-white">Films</span>
          <span>Documentaires</span>
          <span>FAQ</span>
          <span>Aide</span>

          <Link to="/discussion" className="hover:text-white transition">
            Discussion
          </Link>
        </div>

        <div className="flex items-center gap-3">
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

          <button className="bg-zinc-800 px-4 py-2 rounded">
            S’identifier
          </button>

          <button className="bg-white text-black px-4 py-2 rounded">
            S’inscrire
          </button>
        </div>
      </nav>

      <section className="mt-20 mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Regardez, chattez et profitez avec vos amis en temps réel même à distance
        </h2>

        <h2 className="text-3xl font-semibold mb-4">
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

      <section className="px-20 pb-24">
        <h3 className="text-xl font-semibold mb-10">Films</h3>

        {isLoading && <p className="text-zinc-400">Chargement…</p>}
        {error && <p className="text-red-400">Erreur : {error.message}</p>}

        {!isLoading && !error && filteredFilms.length > 0 && (
          <div className="grid grid-cols-5 gap-10">
            {filteredFilms.map((film) => (
              <FilmCard key={film.imdbID} film={film} />
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