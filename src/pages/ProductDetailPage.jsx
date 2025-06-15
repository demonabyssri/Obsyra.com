import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Plus, Minus, Heart, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useProducts } from '@/hooks/useProducts';

const ProductDetailPage = ({ products, handlePurchase, user }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currency } = useStoreSettings();
  const { favorites, toggleFavorite } = useProducts();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.category === 'fashion' && foundProduct.availableSizes && foundProduct.availableSizes.length > 0) {
        setSelectedSize(foundProduct.availableSizes[0]);
      }
    } else {
      toast({ title: "Producto no encontrado", description: "Este producto ya no está disponible o la URL es incorrecta.", variant: "destructive" });
      navigate('/catalogo');
    }
  }, [productId, products, navigate]);

  useEffect(() => {
    if (product) {
      setIsFavorite(favorites.includes(product.id));
    }
  }, [product, favorites]);

  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const currentSymbol = symbols[currency] || '$';

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Inicio de Sesión Requerido",
        description: "Debes iniciar sesión para añadir productos al carrito.",
        action: <Button onClick={() => navigate('/auth/login')} size="sm">Iniciar Sesión</Button>,
      });
      return;
    }
    if (product.stock < quantity) {
      toast({ title: "Stock Insuficiente", description: `Solo quedan ${product.stock} unidades de este producto.`, variant: "destructive" });
      return;
    }
    if (product.category === 'fashion' && !selectedSize) {
        toast({ title: "Talla Requerida", description: "Por favor, selecciona una talla.", variant: "destructive" });
        return;
    }
    handlePurchase(product, quantity, selectedSize);
    toast({
      title: "¡Añadido al Carrito!",
      description: `${product.name} (x${quantity}) ${selectedSize ? `Talla: ${selectedSize}` : ''} ha sido añadido.`,
      action: <Button asChild size="sm"><Link to="/carrito">Ver Carrito</Link></Button>,
    });
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Inicio de Sesión Requerido",
        description: "Debes iniciar sesión para añadir productos a favoritos.",
        action: <Button onClick={() => navigate('/auth/login')} size="sm">Iniciar Sesión</Button>,
      });
      return;
    }
    toggleFavorite(product.id);
  };

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const availableSizes = product.category === 'fashion' ? ['S', 'M', 'L', 'XL', 'XXL'] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-5xl py-8 sm:py-12 px-4"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-8 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground">
        <ChevronLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border aspect-square overflow-hidden"
        >
          <img
            className="w-full h-full object-contain rounded-lg"
            alt={product.imageDescription || `Imagen de ${product.name}`}
           src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary mb-6">{currentSymbol}{product.sellingPrice.toFixed(2)}</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description || "Descripción no disponible."}</p>
            
            {product.category === 'fashion' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Talla:</label>
                <div className="flex space-x-2">
                  {availableSizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md text-sm ${selectedSize === size ? 'btn-gradient-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-accent'}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <label className="block text-sm font-medium text-foreground">Cantidad:</label>
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} className="h-10 w-10 text-muted-foreground hover:bg-accent">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 text-lg font-medium text-foreground">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-10 w-10 text-muted-foreground hover:bg-accent">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {product.stock > 0 ? `${product.stock} unidades disponibles` : <span className="text-destructive font-medium">Producto Agotado</span>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              disabled={product.stock === 0}
              className="w-full sm:flex-1 btn-gradient-primary text-primary-foreground font-semibold py-3 text-lg shadow-lg hover:shadow-primary/40"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? "Agotado" : "Añadir al Carrito"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleToggleFavorite}
              className="w-full sm:w-auto border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground py-3"
            >
              <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'En Favoritos' : 'Favorito'}
            </Button>
          </div>
          {product.supplierUrl && user && user.email === 'jaydenpierre3311@gmail.com' && (
             <a href={product.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-4 block text-center sm:text-left">
                Ver en proveedor (Admin)
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;