// Obsyra-backend/src/routes/products.js
const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

router.get('/', productService.getAllProducts);
router.get('/:id', productService.getProductById);
router.post('/', authenticateToken, authorizeRoles(['admin']), validateProduct, productService.createProduct);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), validateProduct, productService.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), productService.deleteProduct);

module.exports = router;