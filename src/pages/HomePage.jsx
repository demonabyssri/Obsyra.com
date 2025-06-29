import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import HeroSection from '@/components/HeroSection'; 

const AnimatedProductShowcase = ({ products }) => {
  const baseDelay = 0.2; 
  return (
    <div className="relative w-full py-12 sm:py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 text-center">
        Novedades <span className="gradient-text-brand-subtle">Exclusivas</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-card rounded-xl shadow-xl overflow-hidden border border-border/30 group flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: baseDelay + index * 0.1, type: "spring", stiffness: 80 }}
            whileHover={{ translateY: -8, boxShadow: "0px 15px 30px hsla(var(--primary), 0.25)"}}
          >
            <Link to={`/producto/${product.id}`} className="block aspect-[4/3] overflow-hidden">
              <img   
                alt={product.imageDescription || `Imagen de ${product.name}`}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease-in-out"
               src="https://images.unsplash.com/photo-1627577741153-74b82d87607b" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-card-foreground mb-1 truncate group-hover:text-primary transition-colors">
                <Link to={`/producto/${product.id}`}>{product.name}</Link>
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.shortDescription || "Descubre este increíble producto."}</p>
              <div className="mt-auto flex justify-between items-center">
                <p className="text-xl font-bold text-primary">{product.currencySymbol || '$'}{product.sellingPrice.toFixed(2)}</p>
                <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to={`/producto/${product.id}`}>Ver Más</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
         <Button asChild size="lg" className="btn-gradient-primary text-primary-foreground font-semibold py-3.5 px-8 rounded-lg text-lg shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
            <Link to="/catalogo">
                <SearchIcon className="mr-2.5 h-5 w-5" /> Explorar Catálogo Completo
            </Link>
        </Button>
      </div>
    </div>
  );
};


const HomePage = ({ categories, products, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const { storeName, OBSYRA_LOGO_URL } = useStoreSettings();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isAdminView={false} 
      />
      
      {products && products.length > 0 && <AnimatedProductShowcase products={products} /> }
      
      <motion.div 
        className="py-12 sm:py-16 bg-secondary/30"
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
        }}
      >
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10">
                Navega por <span className="gradient-text-brand-subtle">Categorías</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {categories.filter(c => c.id !== 'all').slice(0, 8).map((category) => {
                const Icon = category.icon;
                return (
                <motion.div
                    key={category.id}
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="group"
                    whileHover={{ scale: 1.05 }}
                >
                    <Link to={`/catalogo?category=${category.id}`}>
                    <Button
                        variant="outline"
                        className="bg-card border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300 px-6 py-3 text-base sm:text-lg rounded-xl shadow-md group-hover:shadow-primary/20 w-full sm:w-auto min-w-[180px]"
                    >
                        <Icon className="w-5 h-5 mr-2.5 text-primary group-hover:text-primary transition-colors" />
                        {category.name}
                    </Button>
                    </Link>
                </motion.div>
                );
            })}
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;