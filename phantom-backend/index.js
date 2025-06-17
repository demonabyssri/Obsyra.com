const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "https://phantom-deals.netlify.app",
    "https://phantom-deals.web.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Importación de rutas
const ordersRoute = require("./routes/orders");
const statsRoute = require("./routes/stats");
const configRoute = require("./routes/config");
const extractRoute = require("./routes/extract"); // <- NUEVA ruta de scraping

// Uso de rutas
app.use("/api/orders", ordersRoute);
app.use("/api/stats", statsRoute);
app.use("/api/config", configRoute);
app.use("/api/extract", extractRoute); // <- Activa la ruta para scraping con Puppeteer

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Phantom Deals API funcionando correctamente 🚀");
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});

