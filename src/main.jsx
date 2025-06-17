import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);