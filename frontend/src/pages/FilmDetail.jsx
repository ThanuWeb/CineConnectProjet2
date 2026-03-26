import React from "react";
import { Link, useParams } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import { useFilm } from "../hooks/useFilms";

const FilmDetail = () => {
  const { id } = useParams({ from: "/film/$id" });
  const { data, isLoading, error } = useFilm(id);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white px-20 py-10">
        <div className="mt-4 mb-12">
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

        {isLoading && (
          <p className="text-zinc-400">Chargement...</p>
        )}

        {error && (
          <p className="text-red-500">Erreur : {error.message}</p>
        )}

        {data && (
          <div className="max-w-4xl mx-auto flex gap-10 items-start">
            <img
              src={
                data.Poster !== "N/A"
                  ? data.Poster
                  : "https://via.placeholder.com/300x450"
              }
              alt={data.Title}
              className="w-48 rounded-lg shadow-lg"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-semibold mb-4">
                {data.Title}
              </h1>

              <p className="text-sm text-zinc-400 mb-4">
                {data.Year} • {data.Runtime} • {data.Genre}
              </p>

              <p className="text-zinc-300 leading-relaxed mb-6">
                {data.Plot}
              </p>

              <div className="space-y-2 text-sm text-zinc-400">
                <p>
                  <strong>Réalisateur :</strong> {data.Director}
                </p>
                <p>
                  <strong>Acteurs :</strong> {data.Actors}
                </p>
                <p>
                  <strong>IMDb :</strong> ⭐ {data.imdbRating}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilmDetail;