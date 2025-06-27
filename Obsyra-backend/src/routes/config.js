const express = require('express');
const router = express.Router();
// const configService = require('../services/configService'); // Si creas un servicio
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    // Lógica de configuración aquí o en configService
    res.json({ message: "Endpoint de configuración", data: "Tu data de config aquí" });
});

module.exports = router;