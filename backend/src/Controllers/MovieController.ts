import { Request, Response } from "express";
import { MovieRepository } from "../Infrastructure/Repository/MovieRepository";

interface OmdbSearchResult {
  Response: string;
  Search?: { Title: string; Year: string; imdbID: string; Poster: string }[];
}

interface OmdbDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Director: string;
  Poster: string;
  Plot: string;
  Runtime: string;
  Actors: string;
  imdbRating: string;
}

const movieRepo = new MovieRepository();

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await movieRepo.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getMovieById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID invalide" });
      }
      const movie = await movieRepo.getMovieById(id);
      if (!movie) {
        return res.status(404).json({ error: "Film non trouvé" });
      }
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async searchMovies(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Paramètre de recherche requis" });
      }

      let allOmdbResults: OmdbSearchResult["Search"] = [];
      let page = 1;
      let totalResults = 0;
      const MAX_PAGES = 5; // Limite à 5 pages (50 films max)

      while (page <= MAX_PAGES) {
        const omdbRes = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(q)}&page=${page}`,
        );
        const omdbData = (await omdbRes.json()) as OmdbSearchResult & {
          totalResults?: string;
        };

        if (omdbData.Response !== "True" || !omdbData.Search) break;

        allOmdbResults = allOmdbResults.concat(omdbData.Search);

        if (page === 1 && omdbData.totalResults) {
          totalResults = parseInt(omdbData.totalResults, 10);
        }

        if (
          allOmdbResults.length >= totalResults ||
          omdbData.Search.length < 10
        )
          break;
        page++;
      }

      for (const item of allOmdbResults) {
        const existing = await movieRepo.getMovieByOmdbId(item.imdbID);
        if (existing) continue;

        const detailRes = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${item.imdbID}`,
        );
        const detail = (await detailRes.json()) as OmdbDetail;

        await movieRepo.addMovie({
          omdbId: detail.imdbID,
          title: detail.Title,
          year: parseInt(detail.Year) || null,
          director: detail.Director !== "N/A" ? detail.Director : null,
          posterUrl: detail.Poster !== "N/A" ? detail.Poster : null,
          plot: detail.Plot !== "N/A" ? detail.Plot : null,
          runtimeMinutes: parseInt(detail.Runtime) || null,
          actors: detail.Actors !== "N/A" ? detail.Actors : null,
          imdbRating: detail.imdbRating !== "N/A" ? detail.imdbRating : null,
        });
      }

      const results = await movieRepo.searchByTitle(q);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async refreshPoster(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID invalide" });
      }

      const movie = await movieRepo.getMovieById(id);
      if (!movie) {
        return res.status(404).json({ error: "Film non trouvé" });
      }

      let newPosterUrl: string | null = null;

      if (movie.omdbId) {
        const omdbRes = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movie.omdbId}`,
        );
        const detail = (await omdbRes.json()) as OmdbDetail;
        if (detail.Poster && detail.Poster !== "N/A") {
          newPosterUrl = detail.Poster;
        }
      }

      if (!newPosterUrl) {
        const omdbRes = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movie.title)}`,
        );
        const detail = (await omdbRes.json()) as OmdbDetail;
        if (detail.Poster && detail.Poster !== "N/A") {
          newPosterUrl = detail.Poster;
          if (!movie.omdbId && detail.imdbID) {
            await movieRepo.updateMovie(id, {
              posterUrl: newPosterUrl,
              omdbId: detail.imdbID,
            });
            return res.json({ posterUrl: newPosterUrl });
          }
        }
      }

      if (newPosterUrl) {
        await movieRepo.updateMovie(id, { posterUrl: newPosterUrl });
        return res.json({ posterUrl: newPosterUrl });
      }

      res.status(404).json({ error: "Aucun poster trouvé sur OMDB" });
    } catch (error) {
      console.error("Error refreshing poster:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
