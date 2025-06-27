// Obsyra-backend/src/routes/payments.js
const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { authenticateToken } = require('../middleware/auth');
const stripe = require('../config/stripe'); 

router.post('/create-checkout-session', authenticateToken, paymentService.createCheckoutSession);

// ESTA ES LA RUTA DEL WEBHOOK DE STRIPE (express.raw() ya está en app.js para esta ruta)
router.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    paymentService.handleWebhookEvent(event)
        .then(() => res.json({ received: true }))
        .catch(error => {
            console.error('Error al procesar evento de webhook:', error);
            res.status(500).json({ error: 'Fallo al procesar el evento de webhook.' });
        });
});

module.exports = router;