import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { firebaseInitializationError } from '@/firebase'; 

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

if (firebaseInitializationError) {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif; background-color: #2d1a1a; border: 1px solid #ff4d4d; color: #ffcccc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 2em; color: #ff8080; margin-bottom: 15px;">Error Crítico de Configuración de Firebase</h1>
        <p style="font-size: 1.1em; margin-bottom: 10px;">${firebaseInitializationError}</p>
        <p style="font-size: 1.1em; margin-bottom: 20px;">La aplicación no puede funcionar sin una configuración válida de Firebase.</p>
        <ul style="text-align: left; margin-bottom: 20px; padding-left: 20px; font-size: 1em; max-width: 600px; line-height: 1.6;">
          <li>Asegúrate de tener un archivo <code>.env</code> en la raíz de tu proyecto.</li>
          <li>Verifica que la variable <code>VITE_FIREBASE_API_KEY</code> y otras variables <code>VITE_FIREBASE_*</code> (como <code>VITE_FIREBASE_PROJECT_ID</code>, <code>VITE_FIREBASE_AUTH_DOMAIN</code>, etc.) estén definidas correctamente en ese archivo.</li>
          <li><strong>No uses comillas</strong> alrededor de los valores en el archivo <code>.env</code> (ej: <code>VITE_FIREBASE_API_KEY=TU_API_KEY_AQUI</code>).</li>
          <li>Reinicia tu servidor de desarrollo (<code>npm run dev</code> o el comando que uses) después de crear o modificar el archivo <code>.env</code>.</li>
          <li>Asegúrate de que tu archivo <code>vite.config.js</code> esté configurado para cargar variables de entorno (generalmente Vite lo hace por defecto para variables con prefijo <code>VITE_</code>).</li>
          <li>Consulta la consola del navegador para más detalles técnicos.</li>
        </ul>
        <p style="font-size: 0.9em; color: #aaa;">Si el problema persiste, revisa la documentación de Firebase y Vite sobre variables de entorno, o contacta al desarrollador.</p>
      </div>
    `;
  }
  console.error("CRITICAL: Firebase initialization failed. Application cannot start.", firebaseInitializationError);
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
}
