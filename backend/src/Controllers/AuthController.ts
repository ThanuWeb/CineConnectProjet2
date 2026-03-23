import { UserRepository } from "../Infrastructure/Repository/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }
      const userRepo = new UserRepository();
      const existingUser = await userRepo.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email déjà utilisé" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userRepo.addUser({
        username,
        email,
        passwordHash,
        avatarUrl: null,
        bio: null,
      });
      res
        .status(201)
        .json({ message: "Utilisateur créé avec succès", userId: newUser.id });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }
      const userRepo = new UserRepository();
      const user = await userRepo.getUserByEmail(email);
      if (!user) {
        return res
          .status(400)
          .json({ error: "Email ou mot de passe incorrect" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ error: "Email ou mot de passe incorrect" });
      }
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" },
      );
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const userRepo = new UserRepository();
      const users = await userRepo.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const userRepo = new UserRepository();
      const user = await userRepo.getUserById(userId);
      if (!user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      const { passwordHash, ...safeUser } = user;
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async updateMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { username, bio, avatarUrl } = req.body;
      const userRepo = new UserRepository();
      const updated = await userRepo.updateUser(userId, {
        username,
        bio,
        avatarUrl,
      });
      if (!updated)
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      const { passwordHash, ...safeUser } = updated;
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
