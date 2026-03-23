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
          to="/"
          className="
            inline-flex items-center gap-2
            px-6 py-2
            rounded-md
            bg-zinc-800
            text-zinc-300
            text-sm
            hover:bg-zinc-700
            transition
          "
        >
          ← Retour
        </Link>
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default FilmDetail;
