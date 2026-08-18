"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, trim: true, index: true },
    nome: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido."],
    },
    pontuacao: { type: Number, default: 0, min: 0 },
    progresso: { type: mongoose.Schema.Types.ObjectId, ref: "Progress" },
    medalhas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medal" }],
    nivel: { type: Number, default: 1, min: 1 },
    lastAccessAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
