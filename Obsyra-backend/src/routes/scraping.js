// Obsyra-backend/src/routes/scraping.js
const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraperService');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/start', authenticateToken, authorizeRoles(['admin']), scraperService.startScraping);

module.exports = router;