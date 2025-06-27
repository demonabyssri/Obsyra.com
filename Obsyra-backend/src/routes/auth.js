// Obsyra-backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validateRegistration } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

router.post('/create-user-profile', authenticateToken, authService.createUserProfile);
router.post('/2fa/setup', authenticateToken, authService.setup2FA); 
router.post('/2fa/verify', authenticateToken, authService.verify2FA); 
router.post('/2fa/disable', authenticateToken, authService.disable2FA);

module.exports = router;