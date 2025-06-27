// Obsyra-backend/src/middleware/auth.js
const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        // Verificar token de Firebase ID (viene del frontend)
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken; // El usuario autenticado está disponible en req.user
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(403).json({ message: 'Token inválido o expirado.', error: error.message });
    }
};

const authorizeRoles = (roles = []) => {
    return (req, res, next) => {
        // Asegúrate de que el rol se establezca en los custom claims de Firebase Auth
        // Ej: await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };