const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const scrapingRoutes = require('./routes/scraping');
const adminRoutes = require('./routes/admin');

const errorHandler = require('./utils/errorHandler');

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