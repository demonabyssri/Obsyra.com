const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generate2FASecret = () => {
    return speakeasy.generateSecret({ length: 20 });
};

const verify2FAToken = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
    });
};

const generateQRCodeURL = async (secret) => {
    return await qrcode.toDataURL(secret.otpauth_url);
};

module.exports = { generate2FASecret, verify2FAToken, generateQRCodeURL };