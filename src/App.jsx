import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button'; 
import { Skeleton } from '@/components/ui/skeleton'; 

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddProductModal from '@/components/AddProductModal'; 
import HelpModal from '@/components/HelpModal';
import HomePage from '@/pages/HomePage'; 

import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { firebaseInitializationError } from '@/firebase'; 

const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const RecoverPage = lazy(() => import('@/pages/RecoverPage'));
const CatalogoPage = lazy(() => import('@/pages/CatalogoPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const AddressesPage = lazy(() => import('@/pages/AddressesPage'));
const AccountSettingsPage = lazy(() => import('@/pages/AccountSettingsPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const LegalNoticePage = lazy(() => import('@/pages/LegalNoticePage'));


const PageSkeleton = () => (
  <div className="container mx-auto py-12 px-4">
    <Skeleton className="h-8 w-1/2 mb-6" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);


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
    isLoading: productsLoading,
    updateProductStock,
  } = useProducts();

  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart
  } = useCart(user); 
  
  const { storeName, currency, setCurrency, OBSYRA_LOGO_URL } = useStoreSettings();
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark'; 
  });
  
  useEffect(() => {
    if (firebaseInitializationError) {
      toast({
        title: "Error Crítico de Configuración",
        description: firebaseInitializationError,
        variant: "destructive",
        duration: 20000, 
      });
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
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

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.6 },
      zIndex: 1200
    });
  };

  const handlePlaceOrder = (orderDetails) => {
    const orderPayload = {
      ...orderDetails,
      id: `ORD-OBS-${Date.now()}`, 
      userId: user ? user.uid : 'guest',
      userEmail: user ? user.email : orderDetails.customerInfo?.email || 'N/A',
      userName: user ? user.displayName : orderDetails.customerInfo?.name || 'N/A',
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
      orderDate: new Date().toISOString(),
      status: "Pendiente" 
    };
    
    console.log("Payload del Pedido (Frontend). En un entorno de producción, enviar a backend:", orderPayload);
    toast({
      title: `🎉 ¡Pedido Recibido por ${storeName}! 🎉`,
      description: "¡Gracias por tu compra! Tu pedido se está procesando. Revisa tu panel de pedidos para más detalles.",
      duration: 8000,
      className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg"
    });
    triggerConfetti();
    
    if(user) {
        const existingOrders = JSON.parse(localStorage.getItem(`userOrders_${user.uid}`) || '[]');
        localStorage.setItem(`userOrders_${user.uid}`, JSON.stringify([orderPayload, ...existingOrders]));
        cart.forEach(item => {
          updateProductStock(item.id, item.quantity); 
        });
    }
    
    clearCart();
  };

  if (firebaseInitializationError && (authLoading || productsLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-lg max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Error de Configuración</h1>
          <p className="mb-4">{firebaseInitializationError}</p>
          <p className="text-sm">Consulta la consola del navegador para más detalles técnicos y asegúrate de que tus variables de entorno (<code>VITE_FIREBASE_API_KEY</code>, etc.) estén correctamente configuradas.</p>
        </div>
        <Toaster />
      </div>
    );
  }
  
  if (authLoading || productsLoading) { 
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }


  return (
    <HelmetProvider>
      <Helmet>
        <title>{storeName} - Tu Tienda Online de Confianza</title>
        <meta name="description" content={`Descubre ofertas increíbles en ${storeName}. Electrónicos, moda, hogar y más.`} />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Toaster />
        <Header 
          storeName={storeName}
          logoUrl={OBSYRA_LOGO_URL}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onHelpClick={() => setIsHelpModalOpen(true)}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
        />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageSkeleton />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <HomePage 
                    categories={categories} 
                    products={products.slice(0,8)} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />} 
                />
                
                <Route path="/auth" element={user && !authLoading && !firebaseInitializationError ? <Navigate to="/catalogo" /> : <AuthLayout />}>
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
                      isLoading={productsLoading} 
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
                      updateProductStock={updateProductStock}
                    />
                  </AdminRoute>
                } />
                
                <Route path="/perfil" element={<ProtectedRoute><UserProfilePage user={user} /></ProtectedRoute>} />
                <Route path="/perfil/pedidos" element={<ProtectedRoute><OrdersPage user={user} /></ProtectedRoute>} />
                <Route path="/perfil/lista-deseos" element={<ProtectedRoute><WishlistPage products={products} favorites={favorites} toggleFavorite={toggleFavorite} handlePurchase={handlePurchase} isLoading={productsLoading} isAdminView={false} user={user} /></ProtectedRoute>} />
                <Route path="/perfil/direcciones" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
                <Route path="/perfil/configuracion" element={<ProtectedRoute><AccountSettingsPage user={user} currentTheme={theme} onToggleTheme={toggleTheme} /></ProtectedRoute>} />
                
                <Route path="/carrito" element={<ProtectedRoute><CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} currency={currency} /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} currency={currency} /></ProtectedRoute>} />
                
                <Route path="/terminos-y-condiciones" element={<TermsPage />} />
                <Route path="/politica-de-privacidad" element={<PrivacyPage />} />
                <Route path="/aviso-legal-terceros" element={<LegalNoticePage />} />
                <Route path="/soporte" element={<SupportPage />} />


                <Route path="/products" element={<Navigate to="/catalogo" replace />} />
                <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                <Route path="/register" element={<Navigate to="/auth/register" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<div className="text-center py-20"><h1 className="text-4xl">404 - Página No Encontrada</h1><Button asChild className="mt-4 btn-gradient-primary"><a href="/">Volver al Inicio</a></Button></div>} />
              </Routes>
            </Suspense>
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
        <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} contactEmail="jaydenpierre3311@gmail.com" storeName={storeName} />
        <Footer storeName={storeName} logoUrl={OBSYRA_LOGO_URL} currency={currency} setCurrency={setCurrency} />
      </div>
    </HelmetProvider>
  );
};

export default App;