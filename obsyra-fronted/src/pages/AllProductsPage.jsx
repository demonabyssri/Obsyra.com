import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductsGrid from '@/components/ProductsGrid';
import { Button } from '@/components/ui/button';

const AllProductsPage = ({ 
    products, 
    favorites, 
    toggleFavorite, 
    handlePurchase, 
    isLoading, 
    isAdminView,
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory
}) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 sm:py-12 px-4"
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Todos Nuestros Productos
        </h1>
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Busca en toda la tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 text-base sm:text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/80 backdrop-blur-sm shadow-sm"
            />
            <Button
              disabled // La búsqueda ya filtra en vivo
              className="absolute right-1.5 top-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2 px-4 rounded-lg cursor-default"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "hover:bg-purple-50 border-purple-300 text-purple-700"
                } transition-all duration-300 px-4 py-2 text-sm sm:text-base rounded-lg`}
              >
                <Icon className="w-4 h-4 mr-1.5 sm:mr-2" />
                {category.name}
              </Button>
            );
          })}
        </motion.div>
      </div>

      <ProductsGrid 
        products={products} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
        handlePurchase={handlePurchase} 
        isLoading={isLoading} 
        isAdminView={isAdminView}
      />
    </motion.div>
  );
};

export default AllProductsPage;