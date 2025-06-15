import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ storeName, onStoreNameChange, searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, isAdminView }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableStoreName, setEditableStoreName] = useState(storeName);
  const navigate = useNavigate();

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
    onStoreNameChange(editableStoreName);
    setIsEditingName(false);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="container mx-auto text-center">
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
              className="text-5xl md:text-7xl font-bold text-center bg-transparent border-b-2 border-purple-400 focus:outline-none focus:border-purple-600 text-purple-700"
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
            transition={{ duration: 0.8 }}
          >
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent ${isAdminView ? 'cursor-pointer' : ''}`}
              onClick={handleNameEdit}
            >
              {storeName}
            </h1>
            {isAdminView && (
                <button 
                onClick={handleNameEdit} 
                className="absolute -top-2 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-500 hover:text-purple-700 p-1"
                aria-label="Editar nombre de la tienda"
                >
                <Edit size={24} />
                </button>
            )}
          </motion.div>
        )}

        <motion.p
          className="text-lg sm:text-xl text-gray-500 mb-10 sm:mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Tu tienda online. Productos increíbles, precios imbatibles.
        </motion.p>

        <motion.form
          onSubmit={handleSearchSubmit}
          className="max-w-xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Busca ropa, electrónicos, hogar y más..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 text-base sm:text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/80 backdrop-blur-sm shadow-sm"
            />
            <Button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2 px-4 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </motion.form>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category.id);
                  navigate(`/products?category=${category.id === 'all' ? '' : category.id}`);
                }}
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
    </section>
  );
};

export default HeroSection;