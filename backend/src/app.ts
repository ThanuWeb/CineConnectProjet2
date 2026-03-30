import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/router";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(router);

export { app };
