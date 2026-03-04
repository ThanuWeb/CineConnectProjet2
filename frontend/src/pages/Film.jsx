import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useFilms } from "../hooks/useFilms";

const DEFAULT_SEARCH = "movie";

const Film = () => {
  const [search, setSearch] = useState(DEFAULT_SEARCH);

  const { data, isLoading, error } = useFilms(search);

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Films 🎬</h2>

        {/* recherche simple */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un film..."
          style={{
            width: "350px",
            padding: "10px 14px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            margin: "14px 0 20px",
            outline: "none",
          }}
        />

        {isLoading && <p>Chargement...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Erreur : {error.message}
          </p>
        )}

        {!isLoading && !error && data?.Search?.length === 0 && (
          <p>Aucun résultat</p>
        )}

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {data?.Search?.map((movie) => (
            <div key={movie.imdbID}>
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : ""}
                alt={movie.Title}
                width="150"
                style={{ borderRadius: "10px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Film;