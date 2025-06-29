// Obsyra/vite.config.js - Configuración ROBUSTA para NETLIFY (rutas relativas)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Necesitas importar 'path'

// Establecer la base URL a './' para rutas completamente relativas.
// Esto significa que todos los assets (CSS, JS) se cargarán relativos al index.html.
const BASE_URL = './'; // ¡CAMBIO CLAVE!

export default defineConfig({
  plugins: [react()],
  
  base: BASE_URL, // Configuración de la base URL para la construcción

  build: {
    outDir: 'dist', // La carpeta de salida donde se guardará el build final (Netlify lo publicará)
    assetsDir: 'assets', // Subdirectorio para CSS, JS, imágenes dentro de 'dist' (ej: dist/assets)
    // No debería haber ninguna configuración 'rollupOptions.external' aquí
    // que excluya librerías necesarias.
  },

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'), // Configuración para el alias '@'
    },
  },

  server: { // Configuración solo para desarrollo local (npm run dev)
    cors: true,
    host: '0.0.0.0', // Permite acceso externo en desarrollo
    port: 5173,     // Puerto para desarrollo
  },

  // Elimina cualquier otra configuración compleja que hayas tenido aquí si no está en esta plantilla.
  // Ej: customLogger, addTransformIndexHtml, configHorizonsViteErrorHandler, etc.
  // Esta plantilla es la versión "limpia" y estándar.
});