// Obsyra-backend/src/services/reportService.js
const { db } = require('../config/firebase');

const getDashboardData = async (req, res, next) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const ordersSnapshot = await db.collection('orders').get();
        const productsSnapshot = await db.collection('products').get();

        let totalSales = 0;
        let totalItemsSold = 0;
        let productsCount = productsSnapshot.size;

        ordersSnapshot.forEach(doc => {
            const orderData = doc.data();
            totalSales += orderData.totalAmount || 0;
            if (orderData.items) {
                orderData.items.forEach(item => {
                    totalItemsSold += item.quantity || 0;
                });
            }
        });

        res.status(200).json({
            totalUsers: usersSnapshot.size,
            totalOrders: ordersSnapshot.size,
            totalSales: totalSales.toFixed(2),
            totalItemsSold: totalItemsSold,
            productsCount: productsCount
        });
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        next({ statusCode: 500, message: 'Error al obtener datos del dashboard.' });
    }
};

const getStockStatus = async (req, res, next) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        const stockData = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            stock: doc.data().stock || 0,
            lowStockThreshold: doc.data().lowStockThreshold || 10 
        }));

        res.status(200).json(stockData);
    } catch (error) {
        console.error('Error al obtener estado del stock:', error);
        next({ statusCode: 500, message: 'Error al obtener estado del stock.' });
    }
};

module.exports = { getDashboardData, getStockStatus };