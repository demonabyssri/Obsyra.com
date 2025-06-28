// Obsyra-backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar todas las rutas desde src/routes/
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
// ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
// ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡ EL ESPACIO INVISIBLE ESTABA AQUÍ ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV (justo después de la primera comilla simple)
const scrapingRoutes = require('./routes/scraping'); // ¡ARREGLADO! SIN ESPACIO.
// ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
const adminRoutes = require('./routes/admin');

// Rutas adicionales del "server.js" antiguo:
// IMPORTANTE: Asegúrate de que estos archivos EXISTAN en Obsyra-backend/src/routes/
// Si no existen, Node.js dará "Cannot find module" para ellos.
// Si no los necesitas, ELIMINA la línea de 'require' y la línea de 'app.use' de abajo.
const phantomOrdersRoute = require('./routes/phantom-orders'); 
const statsRoute = require('./routes/stats'); 
const configRoute = require('./routes/config'); 
const extractRoute = require('./routes/extract'); 

const errorHandler = require('./utils/errorHandler');

const app = express();

// Middlewares globales
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, 
    "https://phantom-deals.netlify.app", 
    "https://phantom-deals.web.app"
  ].filter(Boolean), 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Middleware especial para el webhook de Stripe
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware para procesar JSON
app.use(express.json());

// Montar TODAS las rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Ruta de órdenes general (mi estructura)
app.use('/api/payments', paymentRoutes);
app.use('/api/scrape', scrapingRoutes); 
app.use('/api/admin', adminRoutes);

// Montar rutas adicionales (CONFLICTO DE RUTA /api/orders)
// SI LAS DOS RUTAS "/api/orders" HACEN COSAS DIFERENTES, PUEDES TENER PROBLEMAS.
// LO IDEAL ES FUSIONARLAS EN UN SOLO src/routes/orders.js y src/services/orderService.js
// Por ahora, si 'phantomOrdersRoute' tiene más prioridad o es la que quieres, déjala.
app.use("/api/orders-old", phantomOrdersRoute); // ¡SUGERENCIA: Renombrada para evitar conflicto!
app.use("/api/stats", statsRoute);
app.use("/api/config", configRoute);
app.use("/api/extract", extractRoute); 

// Ruta raíz para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("Obsyra Backend API funcionando correctamente 🚀"); 
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;