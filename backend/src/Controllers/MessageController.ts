import { Request, Response } from "express";
import { MessageRepository } from "../Infrastructure/Repository/MessageRepository";

const messageRepo = new MessageRepository();

export class MessageController {
  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { receiverId, content } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ error: "receiverId et content requis" });
      }

      const message = await messageRepo.sendMessage({
        senderId: userId,
        receiverId,
        content,
      });
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getConversation(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const otherUserId = req.params.userId as string;
      const messages = await messageRepo.getConversation(userId, otherUserId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updated = await messageRepo.markAsRead(id);
      if (!updated)
        return res.status(404).json({ error: "Message non trouvé" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
