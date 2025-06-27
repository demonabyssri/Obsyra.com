// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

let serviceAccount;
// Esta línea intenta LEER la variable de entorno.
// Si Render no tiene esta variable configurada, esta condición será falsa.
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) { 
    // Si la variable existe, entonces se parsea su contenido.
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
    // Si la variable NO EXISTE en el entorno de Render, se lanza este error.
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY no está configurado. Es necesario para el Admin SDK.");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL // También lee de las variables de entorno
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };