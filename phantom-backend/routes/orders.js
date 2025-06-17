const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

router.get("/", async (req, res) => {
  const snapshot = await db.collection("orders").get();
  const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(orders);
});

module.exports = router;
