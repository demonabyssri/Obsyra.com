// Obsyra/vite.config.js - VERSIÓN LIMPIA Y ESTÁNDAR PARA PRODUCCIÓN
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Necesitas importar 'path'

// La base URL para el despliegue. Para Netlify, si tu sitio está en la raíz de tu dominio, usa '/'.
// Si tu sitio está en un subdirectorio (ej. 'tudominio.com/mi-app/'), deberías usar '/mi-app/'.
// Para la mayoría de los casos en Netlify, '/' es lo correcto.
// También puedes probar con './' si '/' no funciona después del build (rutas relativas).
const BASE_URL = '/'; 

export default defineConfig({
  plugins: [react()],
  
  base: BASE_URL, // Configuración de la base URL

  build: {
    outDir: 'dist', // Directorio de salida para la construcción (Netlify lo publicará)
    assetsDir: 'assets', // Subdirectorio para assets (CSS, JS, imágenes) dentro de outDir
    // Limpia cualquier configuración de rollupOptions.external si la tenía.
    // Vite se encargará de incluir todas las dependencias necesarias.
  },

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
    alias: {
      // Configuración de alias para '@'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    cors: true, // Para desarrollo local
    host: '0.0.0.0', // Para permitir acceso desde otras IPs en desarrollo si es necesario
    port: 5173, // Puerto para el servidor de desarrollo
  },

  // Elimina todas las otras configuraciones complejas que tenías (customLogger, addTransformIndexHtml, etc.)
});