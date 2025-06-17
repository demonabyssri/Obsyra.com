import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { auth } from '@/firebase'; 

const clearLegacySettings = () => {
  const OBSYRA_BRAND_VERSION = '1.0.1'; 
  const currentBrandVersion = localStorage.getItem('obsyraBrandVersion');

  if (currentBrandVersion !== OBSYRA_BRAND_VERSION) {
    localStorage.removeItem('storeName');
    localStorage.removeItem('storeLogoUrl');
    localStorage.setItem('obsyraBrandVersion', OBSYRA_BRAND_VERSION);
    console.log("Obsyra brand settings reset for version:", OBSYRA_BRAND_VERSION);
  }
};

clearLegacySettings();

const rootElement = document.getElementById('root');

if (!auth || !auth.app || !auth.app.options || !auth.app.options.apiKey || auth.app.options.apiKey === "YOUR_FALLBACK_API_KEY") {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif; background-color: #2d1a1a; border: 1px solid #ff4d4d; color: #ffcccc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 2em; color: #ff8080; margin-bottom: 15px;">Error Crítico de Configuración de Firebase</h1>
        <p style="font-size: 1.1em; margin-bottom: 10px;">La API Key de Firebase (VITE_FIREBASE_API_KEY) no está configurada correctamente en tus variables de entorno o el archivo <code>.env</code> no está siendo leído por Vite.</p>
        <p style="font-size: 1.1em; margin-bottom: 20px;">La aplicación no puede funcionar sin una API Key válida.</p>
        <ul style="text-align: left; margin-bottom: 20px; padding-left: 20px; font-size: 1em;">
          <li>Asegúrate de tener un archivo <code>.env</code> en la raíz de tu proyecto.</li>
          <li>Verifica que la variable <code>VITE_FIREBASE_API_KEY</code> y otras variables <code>VITE_FIREBASE_*</code> estén definidas en ese archivo.</li>
          <li>Reinicia tu servidor de desarrollo (<code>npm run dev</code>) después de crear o modificar el archivo <code>.env</code>.</li>
          <li>Consulta la consola del navegador para más detalles técnicos.</li>
        </ul>
        <p style="font-size: 0.9em; color: #aaa;">Si el problema persiste, contacta al desarrollador.</p>
      </div>
    `;
  }
  console.error("CRITICAL: Firebase API Key is missing or invalid. Application cannot start. Ensure VITE_FIREBASE_API_KEY is set in your .env file and Vite is configured to read it.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
}
