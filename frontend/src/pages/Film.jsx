import React from "react";
import Navbar from "../components/Navbar";
import { useFilms } from "../hooks/useFilms";
import { Link } from "@tanstack/react-router";

const Film = () => {
  const { data, isLoading, error } = useFilms();

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Films</h2>

        {isLoading && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>Erreur : {error.message}</p>}

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {data?.map((movie) => (
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
        </div>
      </div>
    </>
  );
};

export default Film;
