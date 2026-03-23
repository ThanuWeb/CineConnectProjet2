import { Request, Response } from "express";
import { FriendRepository } from "../Infrastructure/Repository/FriendRepository";

const friendRepo = new FriendRepository();

export class FriendController {
  static async sendRequest(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { addresseeId } = req.body;

      if (!addresseeId)
        return res.status(400).json({ error: "addresseeId requis" });
      if (userId === addresseeId)
        return res
          .status(400)
          .json({ error: "Impossible de s'ajouter soi-même" });

      const request = await friendRepo.sendRequest(userId, addresseeId);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async acceptRequest(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.userId;

      const request = await friendRepo.getRequestById(id);
      if (!request)
        return res.status(404).json({ error: "Demande non trouvée" });
      if (request.addresseeId !== userId)
        return res.status(403).json({ error: "Non autorisé" });

      const updated = await friendRepo.updateStatus(id, "accepted");
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async rejectRequest(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.userId;

      const request = await friendRepo.getRequestById(id);
      if (!request)
        return res.status(404).json({ error: "Demande non trouvée" });
      if (request.addresseeId !== userId)
        return res.status(403).json({ error: "Non autorisé" });

      const updated = await friendRepo.updateStatus(id, "rejected");
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getFriends(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const friends = await friendRepo.getFriendsByUserId(userId);
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getPendingRequests(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const pending = await friendRepo.getPendingRequests(userId);
      res.status(200).json(pending);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async deleteFriend(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.userId;

      const friend = await friendRepo.getRequestById(id);
      if (!friend)
        return res.status(404).json({ error: "Relation non trouvée" });
      if (friend.requesterId !== userId && friend.addresseeId !== userId) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      await friendRepo.deleteFriend(id);
      res.status(200).json({ message: "Ami supprimé" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
