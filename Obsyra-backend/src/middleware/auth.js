const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken; 
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(403).json({ message: 'Token inválido o expirado.', error: error.message });
    }
};

const authorizeRoles = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) { 
            return res.status(403).json({ message: 'No autorizado. Rol de usuario no encontrado.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };