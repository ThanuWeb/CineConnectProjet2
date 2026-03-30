import { UserRepository } from "../Infrastructure/Repository/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ReviewRepository } from "../Infrastructure/Repository/ReviewRepository";
import { FriendRepository } from "../Infrastructure/Repository/FriendRepository";
import { FavoriteRepository } from "../Infrastructure/Repository/FavoriteRepository";

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
        preferences: null,
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
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" },
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" },
      );
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token requis" });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
        (err: any, decoded: any) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Refresh token invalide ou expiré" });
          }

          const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" },
          );

          res.status(200).json({ accessToken: newAccessToken });
        },
      );
    } catch (error) {
      console.error("Error during refresh:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const userRepo = new UserRepository();
      const users = await userRepo.getAllUsers();
      const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
      res.status(200).json(safeUsers);
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
      const { username, bio, avatarUrl, preferences } = req.body;
      const userRepo = new UserRepository();
      const updated = await userRepo.updateUser(userId, {
        username,
        bio,
        avatarUrl,
        preferences,
      });
      if (!updated)
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      const { passwordHash, ...safeUser } = updated;
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;
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

  static async getUserStats(req: Request, res: Response) {
    try {
      const userId = req.params.id as string;
      const userRepo = new UserRepository();
      const reviewRepo = new ReviewRepository();
      const friendRepo = new FriendRepository();
      const favoriteRepo = new FavoriteRepository();

      const favoritesCount = await favoriteRepo.countFavoritesByUser(userId);
      const reviewsCount = await reviewRepo.countReviewsByUser(userId);
      const friendsCount = await friendRepo.countAcceptedFriends(userId);

      res.status(200).json({
        favorites: favoritesCount,
        reviews: reviewsCount,
        friends: friendsCount,
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
