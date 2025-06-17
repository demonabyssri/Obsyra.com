import { useState, useEffect } from 'react';

const OBSYRA_LOGO_URL_CONST = "https://storage.googleapis.com/hostinger-horizons-assets-prod/1bb53093-bd34-438d-a3a0-b0ab127eeaa2/53f8bca76bdecc9746af1fff6ea37fe1.jpg";
const STORE_NAME_CONST = "Obsyra";

export const useStoreSettings = () => {
  const [storeName, setStoreName] = useState(STORE_NAME_CONST);
  const [currency, setCurrency] = useState('USD'); 
  const [logoUrl, setLogoUrl] = useState(OBSYRA_LOGO_URL_CONST);

  useEffect(() => {
    localStorage.setItem('storeName', STORE_NAME_CONST);
    localStorage.setItem('storeLogoUrl', OBSYRA_LOGO_URL_CONST);
    setStoreName(STORE_NAME_CONST);
    setLogoUrl(OBSYRA_LOGO_URL_CONST);
    
    const savedCurrency = localStorage.getItem('storeCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    } else {
      localStorage.setItem('storeCurrency', 'USD');
      setCurrency('USD');
    }
  }, []); 

  const updateStoreName = (newName) => {
    setStoreName(newName);
    localStorage.setItem('storeName', newName);
  };

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('storeCurrency', newCurrency);
  }

  const updateLogoUrl = (newLogoUrl) => {
    setLogoUrl(newLogoUrl);
    localStorage.setItem('storeLogoUrl', newLogoUrl);
  };

  return { 
    storeName, 
    updateStoreName, 
    currency, 
    setCurrency: updateCurrency, 
    OBSYRA_LOGO_URL: logoUrl, 
    updateLogoUrl 
  };
};