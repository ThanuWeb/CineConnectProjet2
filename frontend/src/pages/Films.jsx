import { useEffect, useState } from "react";
import { useFilms } from "../hooks/UseFilms";
import FilmCard from "../components/FilmCard";
import SearchBar from "../components/SearchBar";

export default function Films() {
  const [input, setInput] = useState("batman");
  const [search, setSearch] = useState("batman");

  const { data, isLoading } = useFilms(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(input);
    }, 400);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-20 py-6">
        <h1 className="text-2xl font-bold">cineconnect</h1>

        <div style={{ display: "flex", gap: "50px", color: "#ccc" }}>
          <div>Séries</div>
          <div style={{ color: "white" }}>Films</div>
          <div>Documentaires</div>
          <div>FAQ</div>
          <div>Aide</div>
        </div>

        <div className="flex gap-3">
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
        <h3 className="text-xl font-semibold mb-10">
          Films
        </h3>

        {isLoading && (
          <p className="text-zinc-400">Chargement…</p>
        )}

        {!isLoading && data?.Search && (
          <div className="grid grid-cols-5 gap-10">
            {data.Search.map((film) => (
              <FilmCard key={film.imdbID} film={film} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}