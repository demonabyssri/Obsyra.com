// Obsyra-backend/server.js
require('dotenv').config(); // Cargar variables de entorno al principio
const app = require('./src/app'); // Importar la configuración de Express desde src/app.js

const PORT = process.env.PORT || 3000; // Usa 3000 o 5000 como default, Render usará el suyo

app.listen(PORT, () => {
    console.log(`✅ Servidor Obsyra-backend corriendo en: http://localhost:${PORT}`);
});