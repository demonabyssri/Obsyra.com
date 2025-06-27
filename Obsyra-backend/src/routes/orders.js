const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const { authenticateToken } = require('../middleware/auth');
const { validateOrderItem } = require('../middleware/validation');

router.get('/', authenticateToken, orderService.getUserOrders);
router.get('/:id', authenticateToken, orderService.getOrderDetails);

module.exports = router;