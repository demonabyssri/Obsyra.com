
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard'; 
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';


const WishlistPage = ({ products, favorites, toggleFavorite, handlePurchase, isLoading, isAdminView, user }) => {
  const wishlistProducts = products.filter(p => favorites.includes(p.id));
  const navigate = useNavigate();

  const onProductPurchase = (productToBuy) => {
    if (!user) {
        toast({ title: "Inicia Sesión", description: "Debes iniciar sesión para añadir productos al carrito o comprar.", variant: "destructive"});
        navigate('/auth/login'); 
        return;
    }
    handlePurchase(productToBuy); 
  };

  if (wishlistProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-3xl py-12 px-4 text-center"
      >
        <Heart className="mx-auto h-20 w-20 text-red-400/70 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Tu Lista de Deseos está Vacía</h1>
        <p className="text-muted-foreground mb-8">Añade productos que te encanten para verlos aquí.</p>
        <Button asChild className="btn-gradient-primary text-primary-foreground text-lg py-3 px-6">
          <Link to="/catalogo">Descubrir Productos</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 sm:py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 text-red-500 mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Mi Lista de Deseos</h1>
      </div>
      <div className="comparison-grid">
        {wishlistProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            handlePurchase={onProductPurchase}
            isLoading={isLoading}
            isAdminView={isAdminView}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WishlistPage;
