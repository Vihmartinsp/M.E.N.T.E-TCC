"use strict";

const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true, sparse: true, trim: true },
    exam: { type: String, default: "ENEM", trim: true },
    year: { type: Number, required: true, min: 1998 },
    examNumber: { type: Number, min: 1 },
    category: { type: String, required: true, trim: true, index: true },
    topic: { type: String, required: true, trim: true, index: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    statement: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    options: {
      type: [optionSchema],
      required: true,
      validate: [(options) => options.length >= 2, "Inclua pelo menos duas alternativas."],
    },
    correctOption: { type: Number, required: true, min: 0 },
    explanation: { type: String, required: true, trim: true },
    points: { type: Number, default: 10, min: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

questionSchema.index({ category: 1, topic: 1, year: -1 });

module.exports = mongoose.model("Question", questionSchema);
