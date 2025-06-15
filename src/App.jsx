
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button'; 

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddProductModal from '@/components/AddProductModal'; 
import ProductDetailPage from '@/pages/ProductDetailPage';
import HelpModal from '@/components/HelpModal';

import HomePage from '@/pages/HomePage';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RecoverPage from '@/pages/RecoverPage';
import CatalogoPage from '@/pages/CatalogoPage'; 
import AdminPage from '@/pages/AdminPage'; 
import CheckoutPage from '@/pages/CheckoutPage';

import UserProfilePage from '@/pages/UserProfilePage';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import OrdersPage from '@/pages/OrdersPage';
import AddressesPage from '@/pages/AddressesPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';

import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import SupportPage from '@/pages/SupportPage';


import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const App = () => {
  const { user, isAdmin, isLoading: authLoading, JAYDEN_ADMIN_EMAIL } = useAuth();
  const { 
    products, 
    setProducts,
    categories, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    filteredProducts,
    favorites,
    toggleFavorite,
    handleAddProductFromUrl, 
    isAddProductModalOpen,
    setIsAddProductModalOpen,
  } = useProducts();

  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart
  } = useCart(user); 
  
  const { storeName, currency, setCurrency } = useStoreSettings();
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast({
        title: "Tema Actualizado",
        description: `Has cambiado al tema ${newTheme === 'dark' ? 'oscuro' : 'claro'}.`,
    });
  };


  const handlePurchase = (productToBuy, quantity = 1, size = null) => { 
    if (!user) {
      return; 
    }
    addToCart({ ...productToBuy, size: size || undefined }, quantity);
  };

  const handlePlaceOrder = (orderDetails) => {
    const orderPayload = {
      ...orderDetails,
      id: `ORD-${Date.now()}`,
      userId: user ? user.uid : 'guest',
      userEmail: user ? user.email : orderDetails.customerInfo?.email || 'N/A',
      userName: user ? user.name : orderDetails.customerInfo?.name || 'N/A',
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
      orderDate: new Date().toISOString(),
      status: "Pendiente"
    };
    
    console.log("Payload del Pedido:", orderPayload);
    toast({
      title: "Pedido Listo para Procesar",
      description: "En un entorno de producción, aquí se enviaría el pedido al backend para su procesamiento y almacenamiento.",
      duration: 5000,
    });
    
    clearCart();
  };

  if (authLoading) { 
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      <Header 
        storeName={storeName} 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onHelpClick={() => setIsHelpModalOpen(true)}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage categories={categories} />} />
            
            <Route path="/auth" element={user && !authLoading ? <Navigate to="/catalogo" /> : <AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="recover" element={<RecoverPage />} />
              <Route index element={<Navigate to="login" />} />
            </Route>

            <Route path="/catalogo" element={
              <CatalogoPage 
                  products={filteredProducts} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  isLoading={authLoading} 
                  isAdminView={isAdmin} 
                  user={user} 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
              />
            } />
            <Route path="/producto/:productId" element={<ProductDetailPage products={products} handlePurchase={handlePurchase} user={user} />} />


            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage 
                  products={products} 
                  setProducts={setProducts} 
                  setIsAddProductModalOpen={setIsAddProductModalOpen}
                  categories={categories.filter(c => c.id !== 'all')}
                  adminEmail={JAYDEN_ADMIN_EMAIL}
                />
              </AdminRoute>
            } />
            
            <Route path="/perfil" element={<ProtectedRoute><UserProfilePage user={user} /></ProtectedRoute>} />
            <Route path="/perfil/pedidos" element={<ProtectedRoute><OrdersPage user={user} /></ProtectedRoute>} />
            <Route path="/perfil/lista-deseos" element={<ProtectedRoute><WishlistPage products={products} favorites={favorites} toggleFavorite={toggleFavorite} handlePurchase={handlePurchase} isLoading={authLoading} isAdminView={false} user={user} /></ProtectedRoute>} />
            <Route path="/perfil/direcciones" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
            <Route path="/perfil/configuracion" element={<ProtectedRoute><AccountSettingsPage user={user} currentTheme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
            
            <Route path="/carrito" element={<ProtectedRoute><CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} currency={currency} /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} currency={currency} /></ProtectedRoute>} />
            
            <Route path="/terminos-y-condiciones" element={<TermsPage />} />
            <Route path="/politica-de-privacidad" element={<PrivacyPage />} />
            <Route path="/soporte" element={<SupportPage />} />


            <Route path="/products" element={<Navigate to="/catalogo" replace />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<div className="text-center py-20"><h1 className="text-4xl">404 - Página No Encontrada</h1><Button asChild className="mt-4 btn-gradient-primary"><a href="/">Volver al Inicio</a></Button></div>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {isAdmin && (
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onAddProduct={handleAddProductFromUrl} 
          categories={categories.filter(c => c.id !== 'all')}
        />
      )}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} contactEmail="jaydenpierre3311@gmail.com" />
      <Footer storeName={storeName} currency={currency} setCurrency={setCurrency} />
    </div>
  );
};

export default App;
