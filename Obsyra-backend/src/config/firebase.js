// Obsyra-backend/src/config/firebase.js
const admin = require('firebase-admin');

// >>> ¡CAMBIO CRÍTICO AQUÍ! <<<
// Render monta los Secret Files en /etc/secrets/
// El nombre del archivo debe coincidir exactamente con el "Name" que le diste en Render (Paso 2.3)
const serviceAccount = require('/etc/secrets/firebase_adminsdk.json'); 
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Si en Render le pusiste otro nombre al Secret File, cambia 'firebase_adminsdk.json' a ese nombre.

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // serviceAccount ahora ya es el objeto JS correcto
    databaseURL: process.env.FIREBASE_DATABASE_URL 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };