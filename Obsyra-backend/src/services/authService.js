const { auth, db } = require('../config/firebase');
const userModel = require('../models/user');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const createUserProfile = async (req, res, next) => {
    try {
        const { uid, email, name } = req.user; 
        const userData = {
            email: email,
            displayName: name || 'Usuario', 
            role: 'user', 
            createdAt: db.FieldValue.serverTimestamp(),
            updatedAt: db.FieldValue.serverTimestamp()
        };
        await userModel.createUser(uid, userData);
        res.status(201).json({ message: 'Perfil de usuario creado exitosamente', user: { uid, ...userData } });
    } catch (error) {
        console.error('Error al crear perfil de usuario:', error);
        next({ statusCode: 500, message: 'Error al crear perfil de usuario.' });
    }
};

const setup2FA = async (req, res, next) => {
    try {
        const { uid } = req.user; 
        const secret = speakeasy.generateSecret({ length: 20 });

        await auth.setCustomUserClaims(uid, { twoFactorEnabled: true, twoFactorSecret: secret.base32 });
        
        const otpauthUrl = secret.otpauth_url;
        const qrCode = await qrcode.toDataURL(otpauthUrl);

        res.status(200).json({ message: 'Configura tu 2FA', secret: secret.base32, qrCodeUrl: qrCode });
    } catch (error) {
        console.error('Error al configurar 2FA:', error);
        next({ statusCode: 500, message: 'Error al configurar 2FA.' });
    }
};

const verify2FA = async (req, res, next) => {
    try {
        const { uid } = req.user;
        const { token } = req.body;

        const userRecord = await auth.getUser(uid);
        const secret = userRecord.customClaims?.twoFactorSecret; 

        if (!secret) {
            return res.status(400).json({ message: 'La autenticación de doble factor no está configurada para este usuario.' });
        }

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            res.status(200).json({ message: 'Token 2FA verificado exitosamente.', verified: true });
        } else {
            res.status(401).json({ message: 'Token 2FA inválido.', verified: false });
        }
    } catch (error) {
        console.error('Error al verificar 2FA:', error);
        next({ statusCode: 500, message: 'Error al verificar 2FA.' });
    }
};

const disable2FA = async (req, res, next) => {
    try {
        const { uid } = req.user;
        await auth.setCustomUserClaims(uid, { twoFactorEnabled: false, twoFactorSecret: null }); 
        res.status(200).json({ message: '2FA deshabilitado exitosamente.' });
    } catch (error) {
        console.error('Error al deshabilitar 2FA:', error);
        next({ statusCode: 500, message: 'Error al deshabilitar 2FA.' });
    }
};

module.exports = { createUserProfile, setup2FA, verify2FA, disable2FA };