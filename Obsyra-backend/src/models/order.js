const { db } = require('../config/firebase');

const ordersCollection = db.collection('orders');

const createOrder = async (orderData) => {
    const docRef = ordersCollection.doc();
    await docRef.set({ ...orderData, createdAt: db.FieldValue.serverTimestamp(), updatedAt: db.FieldValue.serverTimestamp() });
    return { id: docRef.id, ...orderData };
};

const getOrderById = async (orderId) => {
    const doc = await ordersCollection.doc(orderId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const updateOrder = async (orderId, updateData) => {
    await ordersCollection.doc(orderId).update({ ...updateData, updatedAt: db.FieldValue.serverTimestamp() });
    return { id: orderId, ...updateData };
};

const getUserOrders = async (userId) => {
    const snapshot = await ordersCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = { createOrder, getOrderById, updateOrder, getUserOrders };