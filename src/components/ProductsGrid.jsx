import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

const ProductsGrid = ({ products, favorites, toggleFavorite, handlePurchase, isLoading, isAdminView }) => {
  if (products.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
        <p className="text-gray-600">
          {isAdminView ? "Intenta con otros términos de búsqueda o categorías, ¡o añade tus propios productos!" : "Intenta con otros términos de búsqueda o vuelve más tarde."}
        </p>
      </motion.div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          className="comparison-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handlePurchase={handlePurchase}
                isLoading={isLoading}
                isAdminView={isAdminView}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsGrid;