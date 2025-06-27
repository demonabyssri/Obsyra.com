// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

let serviceAccountJson; // Nombre más claro: Contendrá el OBJETO JSON parseado

// Elimina el console.log de diagnóstico aquí.
// console.log("Valor de FIREBASE_SERVICE_ACCOUNT_KEY en Render:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "CONFIGURADO (longitud: " + process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length + ")" : "NO CONFIGURADO (valor vacío)");

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) { 
    serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    // serviceAccountJson AHORA es un objeto JavaScript (el resultado de JSON.parse)
} else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY no está configurado. Es necesario para el Admin SDK.");
}

admin.initializeApp({
    // >>> ¡ESTA ES LA LÍNEA CLAVE! <<<
    // Pasamos el OBJETO JavaScript parseado directamente al método .cert()
    credential: admin.credential.cert(serviceAccountJson), 
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    databaseURL: process.env.FIREBASE_DATABASE_URL 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };