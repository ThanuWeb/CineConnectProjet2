import "dotenv/config";
import { createApp } from "./app";
import { testConnection } from "./routes/index";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await testConnection();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(` Backend CineConnect démarré sur http://localhost:${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Erreur démarrage serveur:", error);
    process.exit(1);
  }
}

startServer();
