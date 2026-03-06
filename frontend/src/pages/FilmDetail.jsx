import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useFilm } from "../hooks/useFilm";

const FilmDetail = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useFilm(id);

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Link
          to="/film"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            marginBottom: "20px",
          }}
        >
          ← Retour
        </Link>

        {isLoading && <p>Chargement...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Erreur : {error.message}
          </p>
        )}

        {data && !isLoading && !error && (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <img
              src={data.Poster !== "N/A" ? data.Poster : ""}
              alt={data.Title}
              width="220"
              style={{ borderRadius: "12px" }}
            />

            <div style={{ maxWidth: "650px" }}>
              <h2>{data.Title}</h2>

              <p style={{ color: "#777" }}>
                {data.Year} • {data.Runtime} • {data.Genre}
              </p>

              <p>{data.Plot}</p>

              <p>
                <strong>Réalisateur :</strong> {data.Director}
              </p>

              <p>
                <strong>Acteurs :</strong> {data.Actors}
              </p>

              <p>
                <strong>Note IMDb :</strong> ⭐ {data.imdbRating}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilmDetail;