// Obsyra-backend/src/services/paymentService.js
const stripe = require('../config/stripe');
const { db } = require('../config/firebase');
const orderModel = require('../models/order');
const userModel = require('../models/user');
const emailService = require('./emailService');
const pdfService = require('./pdfService');
const productService = require('./productService'); 

const createCheckoutSession = async (req, res, next) => {
    const { items } = req.body; 
    const userId = req.user.uid; 

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Se requiere una lista de items para el checkout.' });
    }

    try {
        // Validar stock antes de crear la sesión de Stripe (usando una transacción)
        const productRefs = {};
        for (const item of items) {
            const productRef = db.collection('products').doc(item.productId);
            productRefs[item.productId] = productRef; 
        }

        await db.runTransaction(async (transaction) => {
            for (const item of items) {
                const productDoc = await transaction.get(productRefs[item.productId]);
                if (!productDoc.exists) {
                    throw new Error(`Producto con ID ${item.productId} no encontrado.`);
                }
                const product = productDoc.data();
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para el producto ${product.name}. Disponibles: ${product.stock}, Pedidos: ${item.quantity}`);
                }
                // Aquí solo validamos, la deducción real del stock ocurre en el webhook
            }
        });

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd', 
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), 
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], 
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/carrito`,
            client_reference_id: userId, 
            metadata: {
                orderItems: JSON.stringify(items), 
                userId: userId,
            }
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error al crear sesión de checkout de Stripe:', error);
        next({ statusCode: 400, message: error.message || 'Error al iniciar el proceso de pago.' });
    }
};

const handleWebhookEvent = async (event) => {
    console.log(`Evento de Stripe recibido: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session.id);

            const userId = session.client_reference_id;
            const orderItems = JSON.parse(session.metadata.orderItems);
            const totalAmount = session.amount_total / 100;
            const customerEmail = session.customer_details?.email; 

            try {
                const batch = db.batch();
                const orderRef = db.collection('orders').doc(); 

                const orderData = {
                    orderId: orderRef.id,
                    userId: userId,
                    items: orderItems,
                    totalAmount: totalAmount,
                    paymentStatus: 'paid', 
                    stripeSessionId: session.id,
                    customerEmail: customerEmail,
                    shippingAddress: session.shipping_details?.address || null, 
                    createdAt: db.FieldValue.serverTimestamp(),
                    updatedAt: db.FieldValue.serverTimestamp()
                };
                batch.set(orderRef, orderData);

                // Deducir stock para cada ítem del pedido
                for (const item of orderItems) {
                    const productRef = db.collection('products').doc(item.productId);
                    const productDoc = await productRef.get();
                    if (!productDoc.exists) {
                         console.warn(`Producto ${item.productId} no encontrado al deducir stock para pedido ${orderRef.id}.`);
                         continue; 
                    }
                    const currentStock = productDoc.data().stock;
                    const newStock = currentStock - item.quantity;
                    if (newStock < 0) {
                        console.error(`ERROR CRÍTICO: Stock negativo para ${item.name} (${item.productId}) después de pago exitoso. Esto NO debería pasar si se validó el stock antes.`);
                        batch.update(productRef, { stock: 0, updatedAt: db.FieldValue.serverTimestamp() }); 
                    } else {
                        batch.update(productRef, { stock: newStock, updatedAt: db.FieldValue.serverTimestamp() });
                    }
                }

                await batch.commit(); 

                const userSnapshot = await userModel.getUserById(userId); 
                const userData = userSnapshot || { email: customerEmail, displayName: 'Cliente' }; 

                const invoicePdfBuffer = await pdfService.generateInvoicePdf(orderData, userData);
                await emailService.sendOrderConfirmation(customerEmail, orderData, invoicePdfBuffer);

                console.log(`Pedido ${orderRef.id} procesado y correo enviado.`);

            } catch (error) {
                console.error('Error al procesar checkout.session.completed en webhook:', error);
            }
            break;
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent.id);
            break;
        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object;
            console.log('PaymentIntent failed:', failedPaymentIntent.id);
            break;
        default:
            console.warn(`Unhandled event type ${event.type}`);
    }
};

module.exports = { createCheckoutSession, handleWebhookEvent };