import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/router";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Backend CineConnect démarré sur http://localhost:${PORT}`);
});
