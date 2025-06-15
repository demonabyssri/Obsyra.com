
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Ghost, Zap, Heart, Package, Home as HomeIcon, ShoppingBag as BeautyIcon, Shirt, ToyBrick, Lamp } from 'lucide-react';

const initialProductsData = []; // Inicia vacío

const categoriesData = [
  { id: 'all', name: 'Todo', icon: Ghost },
  { id: 'electronics', name: 'Electrónicos', icon: Zap },
  { id: 'fashion', name: 'Moda', icon: Shirt },
  { id: 'home', name: 'Hogar', icon: Lamp },
  { id: 'toys', name: 'Juguetes', icon: ToyBrick },
  { id: 'beauty', name: 'Belleza', icon: BeautyIcon },
  { id: 'others', name: 'Otros', icon: Package },
];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('userProducts'));
    if (storedProducts) { // No verificar longitud, permitir lista vacía si así se guardó
      setProducts(storedProducts.map(p => ({ ...p, initialStock: p.initialStock || p.stock })));
    } else {
      setProducts(initialProductsData.map(p => ({ ...p, initialStock: p.initialStock || p.stock }))); // Puede ser una lista vacía
      localStorage.setItem('userProducts', JSON.stringify(initialProductsData));
    }

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = product.description ? product.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const categoryKeywordMatch = product.category ? product.category.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const supplierMatch = product.supplierName ? product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    const matchesSearch = nameMatch || descriptionMatch || categoryKeywordMatch || supplierMatch;
    const matchesCategoryFilter = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategoryFilter;
  });

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    toast({
      title: favorites.includes(productId) ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: "¡Producto actualizado en tu lista de favoritos!",
    });
  };
  
  const handleAddProductFromUrl = (newProductData) => {
    // newProductData ya viene con nombre, descripción y precio original simulados,
    // y precio de venta, categoría y stock del usuario.
    const productWithId = {
      ...newProductData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ID más único
      originalPrice: parseFloat(newProductData.originalPrice),
      sellingPrice: parseFloat(newProductData.sellingPrice),
      stock: parseInt(newProductData.stock),
      initialStock: parseInt(newProductData.stock),
      rating: parseFloat(newProductData.rating || (Math.random() * 1.5 + 3.5).toFixed(1)), // Rating aleatorio mejorado
      reviews: parseInt(newProductData.reviews || Math.floor(Math.random() * 300 + 20)) // Reviews aleatorias mejoradas
    };
    setProducts(prevProducts => {
      const updatedProducts = [productWithId, ...prevProducts];
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
    toast({
      title: "¡Producto Añadido!",
      description: `${newProductData.name} ha sido añadido a tu tienda.`,
    });
  };

  const updateProductStock = (productId, quantitySold) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantitySold) } : p
      );
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };


  return {
    products,
    setProducts, 
    categories: categoriesData,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    favorites,
    toggleFavorite,
    handleAddProductFromUrl, // Cambiado
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    updateProductStock
  };
};
