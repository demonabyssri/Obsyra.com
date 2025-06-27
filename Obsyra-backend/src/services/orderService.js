// Obsyra-backend/src/services/orderService.js
const orderModel = require('../models/order');
const { db } = require('../config/firebase'); 

const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.uid; 
        const orders = await orderModel.getUserOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        next({ statusCode: 500, message: 'Error al obtener pedidos.' });
    }
};

const getOrderDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);

        if (!order || order.userId !== req.user.uid) { 
            return res.status(404).json({ message: 'Pedido no encontrado o no autorizado.' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        next({ statusCode: 500, message: 'Error al obtener detalles del pedido.' });
    }
};

module.exports = { getUserOrders, getOrderDetails };