"use strict";

const mongoose = require("mongoose");

const medalSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    icon: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["questoes", "sequencia", "pontuacao", "simulados", "materias"],
      required: true,
    },
    requirement: {
      metric: { type: String, required: true, trim: true },
      value: { type: Number, required: true, min: 1 },
    },
    pointsBonus: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Medal", medalSchema);
