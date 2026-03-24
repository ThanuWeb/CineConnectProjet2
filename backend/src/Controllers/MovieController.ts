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

      // 1. Chercher sur OMDB
      const omdbRes = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(q)}`,
      );
      const omdbData = (await omdbRes.json()) as OmdbSearchResult;

      if (omdbData.Response === "True" && omdbData.Search) {
        for (const item of omdbData.Search.slice(0, 5)) {
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
          });
        }
      }

      // 2. Retourner tous les résultats DB (incluant ceux qu'on vient d'ajouter)
      const results = await movieRepo.searchByTitle(q);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
