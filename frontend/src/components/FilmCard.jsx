import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";

function isValidPoster(url) {
  return url && url !== "N/A" && url.startsWith("http");
}

export default function FilmCard({ film }) {
  if (!film) return null;

  const queryClient = useQueryClient();
  const initialUrl = isValidPoster(film.posterUrl) ? film.posterUrl : null;
  const [posterSrc, setPosterSrc] = useState(initialUrl);
  const tried = useRef(false);

  // Si pas de poster valide dès le départ, appeler OMDB
  useEffect(() => {
    if (posterSrc || tried.current) return;
    tried.current = true;
    apiFetch(`/movies/${film.id}/poster`, { method: "PATCH" })
      .then((data) => {
        if (isValidPoster(data.posterUrl)) {
          setPosterSrc(data.posterUrl);
        }
      })
      .catch(() => {});
  }, [film.id, posterSrc]);

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["movie", film.id],
      queryFn: () => apiFetch(`/movies/${film.id}`),
    });
  };

  const handleImgError = async () => {
    if (tried.current) {
      setPosterSrc(null);
      return;
    }
    tried.current = true;
    try {
      const data = await apiFetch(`/movies/${film.id}/poster`, {
        method: "PATCH",
      });
      if (isValidPoster(data.posterUrl) && data.posterUrl !== posterSrc) {
        setPosterSrc(data.posterUrl);
        return;
      }
    } catch {}
    setPosterSrc(null);
  };

  return (
    <Link
      to="/film/$id"
      params={{ id: film.id }}
      onMouseEnter={handlePrefetch}
      className="block"
    >
      <div className="group relative cursor-pointer">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={film.title}
            onError={handleImgError}
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
        ) : (
          <div
            className="
              w-[180px]
              aspect-[2/3]
              rounded-md
              bg-zinc-800
              flex items-center justify-center
              text-zinc-500 text-sm text-center
              p-4
              transition
              duration-300
              group-hover:scale-105
              group-hover:shadow-2xl
            "
          >
            Aucun poster
          </div>
        )}

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
