import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "PS4 Games Vault Server", time: new Date().toISOString() });
  });

  // API endpoints for games, comments, stats
  app.get("/api/stats", (req, res) => {
    res.json({
      status: "success",
      totalGames: 14,
      totalDownloads: 624500,
      totalUsers: 1480,
      newGamesThisWeek: 3
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PS4 Games Vault] Servidor rodando com sucesso na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Erro ao iniciar o servidor Express:", err);
});
