"use strict";

const mongoose = require("mongoose");

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI não foi definida. Crie um arquivo .env a partir de .env.example.",
    );
  }

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB Atlas conectado com sucesso.");
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
}

async function disconnectDatabase() {
  connectionPromise = undefined;
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

function databaseStatus() {
  const states = ["desconectado", "conectado", "conectando", "desconectando"];
  return states[mongoose.connection.readyState] || "desconhecido";
}

module.exports = { connectDatabase, databaseStatus, disconnectDatabase };
