// Obsyra-backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const productService = require('../services/productService'); 
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/dashboard-data', authenticateToken, authorizeRoles(['admin']), reportService.getDashboardData);
router.get('/stock-status', authenticateToken, authorizeRoles(['admin']), reportService.getStockStatus);
router.put('/products/:id/stock', authenticateToken, authorizeRoles(['admin']), productService.handleUpdateProductStock);

module.exports = router;