// Obsyra-backend/src/app.js - VERSIÓN LIMPIA Y CORREGIDA
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar SOLO las rutas esenciales que hemos creado y configurado
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const scrapingRoutes = require('./routes/scraping'); // ¡ARREGLADO! SIN ESPACIO.
const adminRoutes = require('./routes/admin');

// -------------------------------------------------------------
// RUTAS ANTIGUAS/ADICIONALES: ELIMINADAS O COMENTADAS POR AHORA
// Para evitar "Cannot find module" si no existen esos archivos.
// Si NECESITAS estas rutas y tienes sus archivos correspondientes en src/routes/,
// DEBES DESCOMENTARLAS y ASEGURARTE de que los archivos existan y funcionen.
// Por ejemplo:
// const statsRoute = require('./routes/stats');
// const configRoute = require('./routes/config');
// -------------------------------------------------------------

const errorHandler = require('./utils/errorHandler');

const app = express();

// Middlewares globales
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,          // Tu URL principal del .env (para Render)
    "https://Obsyra.netlify.app",      // Si tu frontend está en Netlify con este dominio
    "https://Obsyra.web.app"           // Si tu frontend está en Firebase Hosting con este dominio
  ].filter(Boolean), // Filtra cualquier valor null/undefined del array
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Middleware especial para el webhook de Stripe
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware para procesar JSON
app.use(express.json());

// Montar TODAS las rutas (solo las esenciales y configuradas)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Ruta de órdenes general (de mi estructura)
app.use('/api/payments', paymentRoutes);
app.use('/api/scrape', scrapingRoutes); // Ruta de scraping principal
app.use('/api/admin', adminRoutes);

// -------------------------------------------------------------
// Montar rutas adicionales (CONFLICTOS Y REDUNDANCIAS EVITADAS)
// Si uncommentas alguna de las 'require' de arriba, también debes descomentar su 'app.use' aquí.
// Ejemplo:
// app.use("/api/stats", statsRoute);
// app.use("/api/config", configRoute);
// -------------------------------------------------------------

// Ruta raíz para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("Obsyra Backend API funcionando correctamente 🚀"); 
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;