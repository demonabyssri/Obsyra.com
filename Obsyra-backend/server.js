const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(helmet());
app.use(morgan('dev'));

// NOTA IMPORTANTE para Stripe Webhook:
// El middleware 'express.raw()' debe ir ANTES de 'express.json()'
// y aplicarse específicamente a la ruta del webhook para que Stripe pueda verificar la firma.
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware para procesar JSON para el resto de las rutas
app.use(express.json());

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/scrape', scrapingRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

module.exports = app;
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

