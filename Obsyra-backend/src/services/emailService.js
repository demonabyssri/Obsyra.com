// Obsyra-backend/src/services/emailService.js
const sendMail = require('../config/mail'); // Importa la función de envío de SendGrid

const sendOrderConfirmation = async (toEmail, orderDetails, invoicePdfBuffer) => {
    const msg = {
        from: process.env.EMAIL_FROM, // Lee el remitente de las variables de entorno
        to: toEmail,
        subject: `Confirmación de Pedido #${orderDetails.orderId} de tu Tienda`,
        html: `
            <h1>¡Gracias por tu compra en nuestra tienda!</h1>
            <p>Tu pedido <strong>#${orderDetails.orderId}</strong> ha sido confirmado y procesado.</p>
            <p><strong>Monto Total:</strong> $${orderDetails.totalAmount ? orderDetails.totalAmount.toFixed(2) : 'N/A'}</p>
            <p>Los detalles de tu pedido y la factura están adjuntos en formato PDF.</p>
            <br/>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos cordiales,</p>
            <p>El Equipo de Tu Tienda Online</p>
        `,
        attachments: [
            {
                content: invoicePdfBuffer.toString('base64'), 
                filename: `factura-${orderDetails.orderId}.pdf`,
                type: 'application/pdf',
                disposition: 'attachment',
                content_id: 'invoice_pdf'
            }
        ]
    };

    try {
        await sendMail(msg);
        console.log(`Correo de confirmación enviado a ${toEmail} para el pedido ${orderDetails.orderId}`);
    } catch (error) {
        console.error(`Error al enviar correo de confirmación a ${toEmail}:`, error);
    }
};

const sendPasswordResetEmail = async (toEmail, resetLink) => {
    const msg = {
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: 'Restablecimiento de Contraseña para tu Tienda',
        html: `
            <h1>Restablece tu Contraseña</h1>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">Restablecer Contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste esto, ignora este correo.</p>
            <p>Saludos,</p>
            <p>El Equipo de Tu Tienda Online</p>
        `
    };

    try {
        await sendMail(msg);
        console.log(`Correo de restablecimiento enviado a ${toEmail}`);
    } catch (error) {
        console.error(`Error al enviar correo de restablecimiento a ${toEmail}:`, error);
    }
};

module.exports = { sendOrderConfirmation, sendPasswordResetEmail };