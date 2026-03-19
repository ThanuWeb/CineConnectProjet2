import { Router } from "express";
import { MovieController } from "../Controllers/MovieController";
import { AuthController } from "../Controllers/AuthController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

router.get("/movies", authenticateJWT, MovieController.getAllMovies);
router.get("/movies/:id", authenticateJWT, MovieController.getMovieById);

export { router };
