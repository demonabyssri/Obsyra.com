// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

let serviceAccount;

// >>> LÍNEA DE DIAGNÓSTICO <<<
console.log("Valor de FIREBASE_SERVICE_ACCOUNT_KEY en Render:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "CONFIGURADO (longitud: " + process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length + ")" : "NO CONFIGURADO (valor vacío)");
// >>> FIN LÍNEA DE DIAGNÓSTICO <<<

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) { 
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY no está configurado. Es necesario para el Admin SDK.");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };