import { createServer } from "http";
import { app } from "./app";
import { initWebSocket } from "./websocket";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const PORT = Number(process.env.PORT) || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const httpServer = createServer(app);
initWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Backend CineConnect démarré sur http://localhost:${PORT}`);
  console.log(
    `Documentation API disponible sur http://localhost:${PORT}/api-docs`,
  );
});
