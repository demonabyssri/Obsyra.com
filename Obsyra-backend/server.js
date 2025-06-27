require('dotenv').config(); // Cargar variables de entorno al principio
const app = require('./src/app'); // Importar la configuración de Express
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});