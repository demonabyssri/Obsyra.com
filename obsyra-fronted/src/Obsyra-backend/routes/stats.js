const express = require("express");
const router = express.Router();
const { db } = require("../firebase");

router.get("/", async (req, res) => {
  const users = await db.collection("users").get();
  const orders = await db.collection("orders").get();

  const totalUsers = users.size;
  const totalOrders = orders.size;

  let totalRevenue = 0;
  orders.forEach(doc => {
    totalRevenue += doc.data().total || 0;
  });

  res.json({ totalUsers, totalOrders, totalRevenue });
});

module.exports = router;
