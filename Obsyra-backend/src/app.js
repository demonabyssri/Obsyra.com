// Obsyra-backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');     // <-- ¡Importado aquí!
const morgan = require('morgan');     // <-- ¡Importado aquí!

// Importar todas las rutas desde src/routes/
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const scrapingRoutes = require(' ./routes/scraping'); // Renombrado a scrapingRoutes para la consistencia
const adminRoutes = require('./routes/admin');

// Rutas que tenías en tu 'server.js' antiguo
const phantomOrdersRoute = require('./routes/phantom-orders'); // Asumiendo que moves la lógica de ordersRoute a aquí
const statsRoute = require('./routes/stats'); // Asumiendo que moves la lógica de statsRoute a aquí
const configRoute = require('./routes/config'); // Asumiendo que moves la lógica de configRoute a aquí
const extractRoute = require('./routes/extract'); // Asumiendo que moves la lógica de extractRoute a aquí

const errorHandler = require('./utils/errorHandler');

const app = express();

// Middlewares globales
// Combinar las dos configuraciones de CORS. Si tenías un array de orígenes, lo mantenemos.
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, // Tu URL principal de .env
    "https://phantom-deals.netlify.app", // Si quieres mantener estas URLs fijas
    "https://phantom-deals.web.app"
  ].filter(Boolean), // Filtra cualquier valor null/undefined
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Middleware especial para el webhook de Stripe (debe ir ANTES de express.json() para esa ruta específica)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware para procesar JSON para el resto de las rutas
app.use(express.json());

// Montar TODAS las rutas
// Las rutas que ya te di
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/scrape', scrapingRoutes); // Usando el nombre consistente 'scrape'
app.use('/api/admin', adminRoutes);

// Las rutas de tu "server.js" antiguo, si sus archivos están en src/routes/
// ¡Asegúrate de que los archivos './routes/phantom-orders.js', './routes/stats.js', etc., EXISTAN en src/routes/!
app.use("/api/orders", phantomOrdersRoute); // Colisión con /api/orders de arriba, quizás quieres renombrar una
app.use("/api/stats", statsRoute);
app.use("/api/config", configRoute);
app.use("/api/extract", extractRoute); // La ruta de scraping antigua

// Ruta raíz para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("Obsyra Backend API funcionando correctamente 🚀"); // Mensaje actualizado
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;