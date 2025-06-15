
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const LOGO_URL_HOMEPAGE = "https://storage.googleapis.com/hostinger-horizons-assets-prod/1bb53093-bd34-438d-a3a0-b0ab127eeaa2/11ed8307a9d51978635024a70fb0e56a.jpg";


const HomePage = ({ categories }) => {
  const { storeName } = useStoreSettings();
  const visibleCategories = categories.filter(c => c.id !== 'all').slice(0, 5); 

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12 sm:py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 120 }}
        className="inline-block p-2 bg-background rounded-full mb-6 sm:mb-8 shadow-xl border border-border"
      >
        <img src={LOGO_URL_HOMEPAGE} alt={`${storeName} Logo`} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
      </motion.div>

      <motion.h1 
        className="text-4xl md:text-6xl font-extrabold mb-5 text-foreground"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Bienvenido a <span className="gradient-text-brand-subtle">{storeName}</span>
      </motion.h1>

      <motion.p 
        className="text-md sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Tu destino para descubrir hallazgos extraordinarios y ofertas inigualables. Productos selectos, experiencias de compra únicas.
      </motion.p>
      
      <motion.div
        className="max-w-lg mx-auto mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Link to="/catalogo" className="block">
            <Button size="lg" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3.5 px-8 rounded-lg text-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
            <SearchIcon className="mr-2.5 h-5 w-5" /> Explorar Catálogo
            </Button>
        </Link>
      </motion.div>


      <motion.div 
        className="mt-16 sm:mt-20"
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.5 } }
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8">Categorías Destacadas</h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {visibleCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                className="group"
              >
                <Link to={`/catalogo?category=${category.id}`}>
                  <Button
                    variant="outline"
                    className="bg-card border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300 px-5 py-2.5 text-sm sm:text-base rounded-lg shadow-sm group-hover:shadow-primary/15 transform group-hover:scale-105"
                  >
                    <Icon className="w-4 h-4 mr-2 text-primary group-hover:text-primary transition-colors" />
                    {category.name}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
