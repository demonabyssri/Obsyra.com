// Obsyra-backend/src/config/mail.js
const sgMail = require('@sendgrid/mail'); // Importa el SDK oficial de SendGrid

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Lee la clave de las variables de entorno

const sendMail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('Correo enviado con SendGrid');
    } catch (error) {
        console.error('Error al enviar correo con SendGrid:', error.response ? error.response.body : error);
        if (error.response && error.response.body.errors) {
            console.error('Errores de SendGrid:', error.response.body.errors);
        }
        throw error; 
    }
};

module.exports = sendMail;