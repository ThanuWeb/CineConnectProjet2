import "dotenv/config";
import express from "express";
import { router } from "./routes/router";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Backend CineConnect démarré sur http://localhost:${PORT}`);
});
