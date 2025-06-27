const express = require('express');
const router = express.Router();
// const statsService = require('../services/statsService'); // Si creas un servicio
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    // Lógica de estadísticas aquí o en statsService
    res.json({ message: "Endpoint de estadísticas", data: "Tu data de stats aquí" });
});

module.exports = router;