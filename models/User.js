"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail inválido."],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    passwordHash: { type: String, select: false },
    points: { type: Number, default: 0, min: 0 },
    medals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medal" }],
    lastAccessAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
