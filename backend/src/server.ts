import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/router";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Spec JSON brut (optionnel, utile pour Postman)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Backend CineConnect démarré sur http://localhost:${PORT}`);
  console.log(
    `Documentation API disponible sur http://localhost:${PORT}/api-docs`,
  );
});
