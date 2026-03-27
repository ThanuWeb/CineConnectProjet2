import { Link } from "@tanstack/react-router";

export default function FilmCard({ film }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl hover:scale-105 transition">
      <Link to="/film/$id" params={{ id: film.omdbId || film.imdbID }}>
        <img
          src={
            film.posterUrl || film.Poster
              ? film.posterUrl || film.Poster
              : "https://via.placeholder.com/300x450"
          }
          alt={film.title || film.Title}
          className="rounded mb-3 w-full h-[260px] object-cover"
        />
      </Link>

      <h3 className="text-sm font-semibold">{film.title || film.Title}</h3>
      <p className="text-xs text-zinc-400">{film.year || film.Year}</p>
    </div>
  );
}