// Obsyra-backend/src/models/user.js
const { db } = require('../config/firebase');

const usersCollection = db.collection('users');

const createUser = async (uid, data) => {
    await usersCollection.doc(uid).set(data);
    return { id: uid, ...data };
};

const getUserById = async (uid) => {
    const doc = await usersCollection.doc(uid).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

const updateUser = async (uid, data) => {
    await usersCollection.doc(uid).update(data);
    return { id: uid, ...data };
};

module.exports = { createUser, getUserById, updateUser };