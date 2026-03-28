import { Router } from "express";
import { MovieController } from "../Controllers/MovieController";
import { AuthController } from "../Controllers/AuthController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { CategoryController } from "../Controllers/CategoryController";
import { ReviewController } from "../Controllers/ReviewController";
import { FriendController } from "../Controllers/FriendController";
import { MessageController } from "../Controllers/MessageController";
import { FavoriteRepository } from "../Infrastructure/Repository/FavoriteRepository";
import { FavoriteController } from "../Controllers/FavoriteController";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);

router.get("/movies/search", authenticateJWT, MovieController.searchMovies);
router.get("/movies", authenticateJWT, MovieController.getAllMovies);
router.get("/movies/:id", authenticateJWT, MovieController.getMovieById);
router.patch(
  "/movies/:id/poster",
  authenticateJWT,
  MovieController.refreshPoster,
);

router.get("/categories", CategoryController.getAllCategories);
router.post("/categories", authenticateJWT, CategoryController.addCategory);
router.get("/movies/:id/categories", CategoryController.getCategoriesByFilm);
router.post(
  "/movies/:id/categories",
  authenticateJWT,
  CategoryController.addFilmCategory,
);

router.get("/movies/:id/reviews", ReviewController.getReviewsByFilm);
router.post("/movies/:id/reviews", authenticateJWT, ReviewController.addReview);
router.put("/reviews/:id", authenticateJWT, ReviewController.updateReview);
router.delete("/reviews/:id", authenticateJWT, ReviewController.deleteReview);
router.patch("/reviews/:id", authenticateJWT, ReviewController.updateReview);

router.post("/friends/request", authenticateJWT, FriendController.sendRequest);
router.put(
  "/friends/:id/accept",
  authenticateJWT,
  FriendController.acceptRequest,
);
router.put(
  "/friends/:id/reject",
  authenticateJWT,
  FriendController.rejectRequest,
);
router.get("/friends", authenticateJWT, FriendController.getFriends);
router.get(
  "/friends/pending",
  authenticateJWT,
  FriendController.getPendingRequests,
);
router.delete("/friends/:id", authenticateJWT, FriendController.deleteFriend);

router.post("/messages", authenticateJWT, MessageController.sendMessage);
router.get(
  "/messages/:userId",
  authenticateJWT,
  MessageController.getConversation,
);
router.put("/messages/:id/read", authenticateJWT, MessageController.markAsRead);

router.get("/users", authenticateJWT, AuthController.getAllUsers);
router.get("/users/:id", authenticateJWT, AuthController.getUserById);
router.get("/users/:id/stats", authenticateJWT, AuthController.getUserStats);

router.post("/favorites", authenticateJWT, FavoriteController.addFavorite);
router.delete(
  "/favorites/:filmId",
  authenticateJWT,
  FavoriteController.removeFavorite,
);
router.get(
  "/favorites/:filmId",
  authenticateJWT,
  FavoriteController.isFavorite,
);

router.get("/me", authenticateJWT, AuthController.getMe);
router.put("/me", authenticateJWT, AuthController.updateMe);

export { router };
