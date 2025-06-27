const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

// Solo el admin puede modificar
const ADMIN_EMAIL = "jaydenpierre3311@gmail.com";

router.get("/", async (req, res) => {
  const configDoc = await db.collection("settings").doc("store").get();
  res.json(configDoc.exists ? configDoc.data() : {});
});

router.post("/", async (req, res) => {
  const { email, config } = req.body;
  if (email !== ADMIN_EMAIL) return res.status(403).json({ error: "No autorizado" });

  await db.collection("settings").doc("store").set(config, { merge: true });
  res.json({ success: true });
});

module.exports = router;
