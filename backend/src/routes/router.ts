import { Router } from "express";
import { MovieController } from "../Controllers/MovieController";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/movies", MovieController.getAllMovies);
router.get("/movies/:id", MovieController.getMovieById);
export { router };
