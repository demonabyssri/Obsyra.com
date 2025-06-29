// Obsyra/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Para un despliegue en la raíz de un dominio Netlify, '/' es lo correcto.
// Si tu dominio fuera (ej: tudominio.com/mi-app/), entonces sería '/mi-app/'.
const BASE_URL = '/'; // ¡Volvemos a '/'! Esto es lo estándar para la mayoría de deploys de frontend.

export default defineConfig({
  plugins: [react()],
  base: BASE_URL,
  build: {
    outDir: 'dist', // La carpeta que Netlify debe publicar, dentro del 'Base directory'
    assetsDir: 'assets', // Los assets irán a 'dist/assets'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ... otros ajustes ...
});