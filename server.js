"use strict";

const path = require("path");
const express = require("express");
require("dotenv").config();

const {
  connectDatabase,
  databaseStatus,
  disconnectDatabase,
} = require("./config/database");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_request, response) => {
  const status = databaseStatus();
  response.status(status === "conectado" ? 200 : 503).json({
    application: "ok",
    database: status,
  });
});

app.use(
  ["/server.js", "/package.json", "/package-lock.json", "/config", "/models"],
  (_request, response) => response.sendStatus(404),
);

app.use(express.static(path.join(__dirname), { dotfiles: "deny" }));

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "Rota da API não encontrada." });
});

async function startServer() {
  await connectDatabase();
  return app.listen(port, () => {
    console.log(`M.E.N.T.E disponível em http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Não foi possível iniciar a aplicação:", error.message);
    process.exit(1);
  });
}

async function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando conexão com o MongoDB...`);
  await disconnectDatabase();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

module.exports = { app, startServer };
