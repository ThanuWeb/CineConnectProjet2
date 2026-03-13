import { Request, Response } from "express";
import { MovieRepository } from "../Infrastructure/Repository/MovieRepository";

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
}
