
import { useState, useEffect } from 'react';

export const useStoreSettings = () => {
  const [storeName, setStoreName] = useState("Phantom Deals");
  const [currency, setCurrency] = useState('USD'); // Moneda por defecto

  useEffect(() => {
    const savedStoreName = localStorage.getItem('storeName');
    if (savedStoreName) {
      setStoreName(savedStoreName);
    } else {
      localStorage.setItem('storeName', storeName);
    }
    const savedCurrency = localStorage.getItem('storeCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    } else {
      localStorage.setItem('storeCurrency', currency);
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

  return { storeName, updateStoreName, currency, setCurrency: updateCurrency };
};
