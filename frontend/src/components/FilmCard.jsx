import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";

export default function FilmCard({ film }) {
  if (!film) return null;

  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["movie", film.id],
      queryFn: () => apiFetch(`/movies/${film.id}`),
    });
  };

  return (
    <Link
      to="/film/$id"
      params={{ id: film.id }}
      onMouseEnter={handlePrefetch}
      className="block"
    >
      <div className="group relative cursor-pointer">
        <img
          src={film.posterUrl || "https://via.placeholder.com/300x450"}
          alt={film.title}
          className="
            w-[180px]
            aspect-[2/3]
            object-cover
            rounded-md
            transition
            duration-300
            group-hover:scale-105
            group-hover:shadow-2xl
          "
        />

        <div
          className="
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t from-black via-black/70 to-transparent
            p-3 opacity-0 group-hover:opacity-100 transition
          "
        >
          <p className="text-sm font-medium">{film.title}</p>
          <p className="text-xs text-zinc-400">{film.year}</p>
        </div>
      </div>
    </Link>
  );
}
