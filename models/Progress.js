"use strict";

const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOption: { type: Number, required: true, min: 0 },
    correct: { type: Boolean, required: true },
    pointsEarned: { type: Number, default: 0, min: 0 },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    answers: { type: [answerSchema], default: [] },
    studyMinutes: { type: Number, default: 0, min: 0 },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    lastStudyAt: { type: Date },
    reviewTopics: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Progress", progressSchema);
