// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

let serviceAccountJson; // Renombrado para claridad
// Borra el console.log de diagnóstico aquí.

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) { 
    serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY no está configurado. Es necesario para el Admin SDK.");
}

admin.initializeApp({
    // >>> CAMBIO CRÍTICO AQUÍ <<<
    // Pasa directamente el objeto JSON parseado (serviceAccountJson)
    credential: admin.credential.cert(serviceAccountJson), 
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    databaseURL: process.env.FIREBASE_DATABASE_URL 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };