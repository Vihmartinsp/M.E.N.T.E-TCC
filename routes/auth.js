"use strict";

const express = require("express");
const { getFirebaseAdminAuth } = require("../config/firebaseAdmin");
const { Progress, Ranking, User } = require("../models");

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.nome,
    email: user.email,
    points: user.pontuacao,
    progress: user.progresso,
    medals: user.medalhas,
    level: user.nivel,
    createdAt: user.createdAt,
  };
}

router.post("/firebase", async (request, response, next) => {
  try {
    const authorization = request.get("authorization") || "";
    const [scheme, idToken] = authorization.split(" ");
    if (scheme !== "Bearer" || !idToken) {
      return response.status(401).json({ error: "Token do Firebase não informado." });
    }

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken);
    if (!decoded.email) {
      return response.status(400).json({ error: "A conta não possui um e-mail válido." });
    }

    const name = decoded.name || request.body?.name || decoded.email.split("@")[0];
    let user = await User.findOne({ firebaseUid: decoded.uid });
    let created = false;

    if (!user) {
      user = await User.findOne({ email: decoded.email.toLowerCase() });
      if (user) {
        user.firebaseUid = decoded.uid;
        user.nome = name;
        user.lastAccessAt = new Date();
        await user.save();
      } else {
        user = await User.create({
          firebaseUid: decoded.uid,
          nome: name,
          email: decoded.email,
          lastAccessAt: new Date(),
        });
        created = true;
      }
    } else {
      user.nome = name;
      user.email = decoded.email;
      user.lastAccessAt = new Date();
      await user.save();
    }

    const progress = await Progress.findOneAndUpdate(
      { user: user.id },
      { $setOnInsert: { user: user.id } },
      { new: true, upsert: true },
    );
    if (!user.progresso || !user.progresso.equals(progress.id)) {
      user.progresso = progress.id;
      await user.save();
    }

    await Ranking.updateOne(
      { user: user.id },
      { $setOnInsert: { user: user.id }, $set: { points: user.pontuacao } },
      { upsert: true },
    );

    return response.status(created ? 201 : 200).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      return response.status(401).json({ error: "Sessão do Firebase inválida ou expirada." });
    }
    return next(error);
  }
});

module.exports = router;
