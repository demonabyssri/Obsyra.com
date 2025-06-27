// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Si la clave está en una variable de entorno como string JSON (para Render)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
    // Manejo de error si la clave no está disponible (no debería ocurrir en Render)
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY no está configurado. Es necesario para el Admin SDK.");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL // Opcional si solo usas Firestore
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };