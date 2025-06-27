// Obsyra-backend/src/config/mail.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Esta función es un wrapper para enviar correos usando el SDK de SendGrid
const sendMail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('Correo enviado con SendGrid');
    } catch (error) {
        console.error('Error al enviar correo con SendGrid:', error.response ? error.response.body : error);
        if (error.response && error.response.body.errors) {
            console.error('Errores de SendGrid:', error.response.body.errors);
        }
        throw error; // Re-lanza el error para que sea capturado por el errorHandler
    }
};

module.exports = sendMail;