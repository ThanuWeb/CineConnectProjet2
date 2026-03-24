import { Request, Response } from "express";
import { ReviewRepository } from "../Infrastructure/Repository/ReviewRepository";

const reviewRepo = new ReviewRepository();

export class ReviewController {
  static async getReviewsByFilm(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const reviews = await reviewRepo.getReviewsByFilmId(id);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async addReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { rating, comment } = req.body;
      const userId = (req as any).user.userId;

      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ error: "Note entre 1 et 10 requise" });
      }

      const existing = await reviewRepo.getReviewByUserAndFilm(userId, id);
      if (existing) {
        return res.status(400).json({ error: "Vous avez déjà noté ce film" });
      }

      const review = await reviewRepo.addReview({
        userId,
        filmId: id,
        rating,
        comment: comment || null,
      });
      res.status(201).json(review);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async updateReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { rating, comment } = req.body;
      const userId = (req as any).user.userId;

      const review = await reviewRepo.getReviewById(id);
      if (!review) return res.status(404).json({ error: "Avis non trouvé" });
      if (review.userId !== userId)
        return res.status(403).json({ error: "Non autorisé" });

      const updated = await reviewRepo.updateReview(id, { rating, comment });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async deleteReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.userId;

      const review = await reviewRepo.getReviewById(id);
      if (!review) return res.status(404).json({ error: "Avis non trouvé" });
      if (review.userId !== userId)
        return res.status(403).json({ error: "Non autorisé" });

      await reviewRepo.deleteReview(id);
      res.status(200).json({ message: "Avis supprimé" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
