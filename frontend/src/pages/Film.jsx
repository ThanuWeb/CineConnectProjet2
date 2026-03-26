import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useFilms } from "../hooks/useFilms";
import { apiFetch } from "../api";
import { Link, useSearch } from "@tanstack/react-router";

const Film = () => {
  const { data, isLoading, error } = useFilms();
  const { q } = useSearch({ strict: false });
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!q) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    apiFetch(`/movies/search?q=${encodeURIComponent(q)}`)
      .then((results) => setSearchResults(results))
      .catch(console.error)
      .finally(() => setSearching(false));
  }, [q]);

  const moviesToDisplay = searchResults ?? data;

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>{q ? `Résultats pour "${q}"` : "Films"}</h2>

        {(isLoading || searching) && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {moviesToDisplay?.map((movie) => (
            <Link
              key={movie.id}
              to={`/film/${movie.id}`}
              style={{ textDecoration: "none" }}
            >
              <div>
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    width="150"
                    style={{ borderRadius: "10px" }}
                  />
                )}
                <p style={{ color: "#fff", textAlign: "center" }}>
                  {movie.title}
                </p>
              </div>
            </Link>
          ))}
          {searchResults?.length === 0 && (
            <p style={{ color: "#aaa" }}>Aucun film trouvé</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Film;
