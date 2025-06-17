import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const BackgroundProductImage = ({ src, alt, className, initial, animate, transition }) => (
  <motion.div
    className={`absolute rounded-lg overflow-hidden shadow-xl border border-border/20 ${className}`}
    initial={initial}
    animate={animate}
    transition={transition}
  >
    <img-replace src={src} alt={alt} class="w-full h-full object-cover" />
  </motion.div>
);

const HeroSection = ({ searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, isAdminView }) => {
  const { storeName, updateStoreName } = useStoreSettings();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableStoreName, setEditableStoreName] = useState(storeName);
  const navigate = useNavigate();

  useEffect(() => {
    setEditableStoreName(storeName);
  }, [storeName]);

  const handleNameEdit = () => {
    if(isAdminView) setIsEditingName(true);
    else {
        toast({
            title: "Acción no permitida",
            description: "Solo los administradores pueden cambiar el nombre de la tienda.",
            variant: "destructive"
        });
    }
  };

  const handleNameSave = () => {
    if (editableStoreName.trim() === "") {
        toast({
            title: "Nombre no válido",
            description: "El nombre de la tienda no puede estar vacío.",
            variant: "destructive",
        });
        setEditableStoreName(storeName); 
        setIsEditingName(false);
        return;
    }
    updateStoreName(editableStoreName);
    setIsEditingName(false);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/catalogo?search=${encodeURIComponent(searchTerm)}`);
  };

  const productImages = [
    { id: 'p1', alt: 'Elegante reloj inteligente oscuro sobre fondo texturizado', className: 'w-32 h-40 sm:w-40 sm:h-52 top-10 left-5 sm:left-10 rotate-[-15deg]', initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5, duration: 0.8, type: 'spring' } },
    { id: 'p2', alt: 'Auriculares inalámbricos premium con diseño minimalista', className: 'w-28 h-36 sm:w-36 sm:h-44 bottom-10 right-5 sm:right-10 rotate-[10deg]', initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.7, duration: 0.8, type: 'spring' } },
    { id: 'p3', alt: 'Moderna chaqueta de cuero negro con detalles metálicos', className: 'w-36 h-48 sm:w-48 sm:h-60 top-1/2 left-1/4 sm:left-1/3 transform -translate-y-1/2 -translate-x-1/2 rotate-[5deg] opacity-80', initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 0.7, scale: 1 }, transition: { delay: 0.9, duration: 0.8, type: 'spring' } },
    { id: 'p4', alt: 'Zapatillas deportivas de alta tecnología con suela luminiscente', className: 'w-24 h-32 sm:w-32 sm:h-40 top-20 right-1/4 sm:right-1/3 rotate-[20deg] opacity-70', initial: { opacity: 0, y: -50 }, animate: { opacity: 0.6, y: 0 }, transition: { delay: 1.1, duration: 0.8, type: 'spring' } }
  ];


  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0">
        <img-replace 
            alt="Fondo abstracto oscuro con partículas de luz azuladas y nebulosas, evocando tecnología y misterio" 
            class="w-full h-full object-cover opacity-30 dark:opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background"></div>
      </div>

      {productImages.map(img => <BackgroundProductImage key={img.id} alt={img.alt}>{img.alt}</BackgroundProductImage>)}
      
      <div className="container mx-auto text-center relative z-10">
        {isEditingName && isAdminView ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mb-6"
          >
            <input 
              type="text"
              value={editableStoreName}
              onChange={(e) => setEditableStoreName(e.target.value)}
              onBlur={handleNameSave}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
              className="text-5xl md:text-7xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:outline-none focus:border-primary text-foreground"
              autoFocus
            />
            <Button onClick={handleNameSave} variant="ghost" className="ml-2 text-green-500 hover:text-green-600">
              Guardar
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="group relative inline-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent ${isAdminView ? 'cursor-pointer' : ''}`}
              onClick={handleNameEdit}
            >
              {storeName}
            </h1>
            {isAdminView && (
                <button 
                onClick={handleNameEdit} 
                className="absolute -top-2 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary hover:text-primary/70 p-1"
                aria-label="Editar nombre de la tienda"
                >
                <Edit size={24} />
                </button>
            )}
          </motion.div>
        )}

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Explora lo enigmático. Descubre lo extraordinario. {storeName}, donde el misterio se encuentra con el estilo.
        </motion.p>

        <motion.form
          onSubmit={handleSearchSubmit}
          className="max-w-xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Busca misterios, tendencias y más..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 text-base sm:text-lg rounded-xl border-2 border-border focus:border-primary focus:outline-none bg-card/80 backdrop-blur-sm shadow-lg text-foreground placeholder-muted-foreground"
            />
            <Button
              type="submit"
              className="absolute right-1.5 top-1.5 btn-gradient-primary text-primary-foreground py-2 px-4 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </motion.form>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category.id);
                  navigate(`/catalogo?category=${category.id === 'all' ? '' : category.id}`);
                }}
                className={`${
                  selectedCategory === category.id
                    ? "btn-gradient-primary text-primary-foreground shadow-md"
                    : "hover:bg-secondary/50 border-border text-muted-foreground"
                } transition-all duration-300 px-4 py-2 text-sm sm:text-base rounded-lg`}
              >
                <Icon className="w-4 h-4 mr-1.5 sm:mr-2" />
                {category.name}
              </Button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;