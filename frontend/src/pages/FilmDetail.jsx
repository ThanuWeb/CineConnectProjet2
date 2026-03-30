import { Link, useParams } from "@tanstack/react-router";
import { useFilm } from "../hooks/useFilms";
import FavoriteButton from "../components/FavoriteButton";
import RatingStars from "../components/RatingStars";
import CommentsSection from "../components/CommentsSection";

export default function FilmDetail() {
  const { id } = useParams({ from: "/film/$id" });
  const { data, isLoading, error } = useFilm(id);

  console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZ");
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Aucun film trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            to="/films"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition"
          >
            ← Retour
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-10 items-start">
            <div>
              <img
                src={
                  data.posterUrl && data.posterUrl !== "N/A"
                    ? data.posterUrl
                    : "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={data.title || "Film"}
                className="w-full max-w-[300px] rounded-xl shadow-lg object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4">
                {data.title || "Titre indisponible"}
              </h1>

              <p className="text-zinc-400 text-lg mb-6">
                {data.year || "Année inconnue"} •{" "}
                {data.runtimeMinutes || "Durée inconnue"} •{" "}
                {data.genre || "Genre inconnu"}
              </p>

              <p className="text-zinc-300 leading-relaxed mb-8">
                {data.plot || "Aucun résumé disponible."}
              </p>

              <div className="space-y-3 text-base text-zinc-300 mb-8">
                <p>
                  <strong className="text-white">Réalisateur :</strong>{" "}
                  {data.director || "Inconnu"}
                </p>
                <p>
                  <strong className="text-white">Acteurs :</strong>{" "}
                  {data.actors || "Inconnus"}
                </p>
                <p>
                  <strong className="text-white">IMDb :</strong> ⭐{" "}
                  {data.imdbRating || "Non noté"}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <FavoriteButton filmId={data.id} />
              </div>
            </div>
          </div>

          <CommentsSection filmId={data.id} />
        </div>
      </div>
    </div>
  );
}
