import React from "react";
import Navbar from "../components/Navbar";
import { useFilm } from "../hooks/useFilms";
import { Link, useParams } from "@tanstack/react-router";

const FilmDetail = () => {
  const { id } = useParams({ strict: false });
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
        {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}

        {data && (
          <div
            style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
          >
            {data.posterUrl && (
              <img
                src={data.posterUrl}
                alt={data.title}
                width="220"
                style={{ borderRadius: "12px" }}
              />
            )}
            <div style={{ maxWidth: "650px" }}>
              <h2>{data.title}</h2>
              <p style={{ color: "#777" }}>
                {data.year}{" "}
                {data.runtimeMinutes && `• ${data.runtimeMinutes} min`}
              </p>
              {data.plot && <p>{data.plot}</p>}
              {data.director && (
                <p>
                  <strong>Réalisateur :</strong> {data.director}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilmDetail;
