
import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ListFilter } from 'lucide-react';
import ProductsGrid from '@/components/ProductsGrid';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CatalogoPage = ({ 
    products, 
    favorites, 
    toggleFavorite, 
    isLoading, 
    isAdminView,
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams, setSelectedCategory, setSearchTerm, selectedCategory, searchTerm]);

  const handleFilterClick = () => {
    toast({
        title: "🚧 Filtros Avanzados Próximamente",
        description: "Estamos trabajando para que puedas filtrar por precio, marca y más. ¡Mantente atento!",
        variant: "default"
    });
  };
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if(categoryId === 'all') {
      setSearchParams(prev => {
        prev.delete('category');
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.set('category', categoryId);
        return prev;
      });
    }
  };

  const handleSearchInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm) {
      setSearchParams(prev => {
        prev.set('search', newSearchTerm);
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.delete('search');
        return prev;
      });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 sm:py-12 px-4"
    >
      <div className="mb-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Explora Nuestro Universo de Ofertas
          </h1>
          <p className="text-lg text-muted-foreground">
            Encuentra productos únicos y precios fantasma. ¡Tu próxima gran compra te espera!
          </p>
        </motion.div>
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Busca en Phantom Deals..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="w-full pl-12 pr-4 py-3.5 text-base sm:text-lg rounded-xl border-2 border-border focus:border-primary focus:outline-none bg-card text-foreground placeholder-muted-foreground shadow-sm transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <ListFilter className="w-4 h-4 mr-2" />
                        {categories.find(c => c.id === selectedCategory)?.name || "Categorías"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-popover border-border">
                    <DropdownMenuLabel>Selecciona Categoría</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                        <DropdownMenuItem key={category.id} onSelect={() => handleCategoryChange(category.id)} className={`cursor-pointer ${selectedCategory === category.id ? 'bg-accent text-accent-foreground' : 'hover:!bg-accent/20'}`}>
                            <Icon className="w-4 h-4 mr-2" />
                            {category.name}
                        </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                onClick={handleFilterClick}
                className="w-full sm:w-auto border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                title="Filtros Avanzados"
            >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros Avanzados
            </Button>
        </motion.div>
      </div>

      <ProductsGrid 
        products={products} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite} 
        isLoading={isLoading} 
        isAdminView={isAdminView}
      />
    </motion.div>
  );
};

export default CatalogoPage;
