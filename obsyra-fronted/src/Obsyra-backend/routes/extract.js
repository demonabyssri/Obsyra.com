const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL faltante" });

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => ({
      title: document.querySelector("title")?.innerText,
      price: document.querySelector(".price")?.innerText || null,
      image: document.querySelector("img")?.src || null,
    }));

    await browser.close();
    res.json({ url, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
