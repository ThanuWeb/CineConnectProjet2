import express, { Express, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { router } from "./routes/index";

// Types pour Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineConnect API",
      version: "1.0.0",
      description: "API pour CinConnect - Films, Users, Chat",
    },
  },
  apis: ["./src/routes/*.ts"], // Chemin vers les routes annotées
};

const specs = swaggerJsDoc(swaggerOptions);

export function createApp(): Express {
  const app = express();

  // Middlewares
  app.use(
    cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api", router);

  // Swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
