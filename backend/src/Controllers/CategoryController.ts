import { Request, Response } from "express";
import { CategoryRepository } from "../Infrastructure/Repository/CategoryRepository";

const categoryRepo = new CategoryRepository();

export class CategoryController {
  static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryRepo.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async addCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ error: "Le nom est requis" });
      const category = await categoryRepo.addCategory({
        name,
        description: description || null,
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getCategoriesByFilm(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const categories = await categoryRepo.getCategoriesByFilmId(id);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async addFilmCategory(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { categoryId } = req.body;
      if (!categoryId)
        return res.status(400).json({ error: "categoryId requis" });
      await categoryRepo.addFilmCategory(id, categoryId);
      res.status(201).json({ message: "Catégorie ajoutée au film" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
