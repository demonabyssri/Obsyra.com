const { db } = require('../config/firebase');

const productsCollection = db.collection('products');

const createProduct = async (productData) => {
    const docRef = productsCollection.doc();
    await docRef.set({ ...productData, createdAt: db.FieldValue.serverTimestamp(), updatedAt: db.FieldValue.serverTimestamp() });
    return { id: docRef.id, ...productData };
};

const getAllProducts = async () => {
    const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getProductById = async (id) => {
    const doc = await productsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const updateProduct = async (id, updateData) => {
    await productsCollection.doc(id).update({ ...updateData, updatedAt: db.FieldValue.serverTimestamp() });
    return { id, ...updateData };
};

const deleteProduct = async (id) => {
    await productsCollection.doc(id).delete();
    return { message: 'Producto eliminado' };
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };