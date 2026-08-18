"use strict";

const mongoose = require("mongoose");

const rankingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    points: { type: Number, default: 0, min: 0, index: true },
    correctAnswers: { type: Number, default: 0, min: 0 },
    answeredQuestions: { type: Number, default: 0, min: 0 },
    position: { type: Number, min: 1 },
  },
  { timestamps: true },
);

rankingSchema.index({ points: -1, correctAnswers: -1, updatedAt: 1 });

module.exports = mongoose.model("Ranking", rankingSchema);
