import { Request, Response } from "express";
import { FavoriteRepository } from "../Infrastructure/Repository/FavoriteRepository";

const favoriteRepo = new FavoriteRepository();

export class FavoriteController {
  static async addFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { filmId } = req.body;
      if (!filmId) return res.status(400).json({ error: "filmId requis" });
      await favoriteRepo.addFavorite(userId, filmId);
      res.status(201).json({ message: "Ajouté aux favoris" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async removeFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const filmId = req.params.filmId.toString();
      await favoriteRepo.removeFavorite(userId, filmId);
      res.json({ message: "Retiré des favoris" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async isFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const filmId = req.params.filmId.toString();
      const isFav = await favoriteRepo.isFavorite(userId, filmId);
      res.json({ isFavorite: isFav });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
