import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFilms, useSearchFilms } from "../hooks/useFilms";
import { useCategories } from "../hooks/useCategories";
import FilmCard from "../components/FilmCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

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

  const { data: allCategories, isLoading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("");

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
      const categoryMatch = selectedCategory
        ? film.categories?.some(
            (cat) => cat.name?.toLowerCase() === selectedCategory.toLowerCase(),
          )
        : true;
      return yearMatch && directorMatch && categoryMatch;
    });
  }, [data, year, director, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* FILTRES CENTRÉS */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-wrap gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600"
          >
            <option value="">Catégorie</option>
            {allCategories?.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
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
