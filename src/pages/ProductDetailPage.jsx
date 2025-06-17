
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ShoppingCart, Plus, Minus, Heart, Star, CheckCircle, MessageSquare, Share2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard';

const ProductDetailPage = ({ products: allProductsFromApp, handlePurchase, user }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currency, storeName } = useStoreSettings();
  const { favorites, toggleFavorite, isLoading: productsLoading, categories, products: productsFromHook } = useProducts(); 

  const productsToUse = allProductsFromApp || productsFromHook;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [otherCustomersBought, setOtherCustomersBought] = useState([]);


  useEffect(() => {
    if (productsLoading) return; 

    const foundProduct = productsToUse.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.category === 'fashion' && foundProduct.availableSizes && foundProduct.availableSizes.length > 0) {
        setSelectedSize(foundProduct.availableSizes[0]);
      }
      
      const related = productsToUse.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 4);
      setRelatedProducts(related);

      const shuffled = [...productsToUse].sort(() => 0.5 - Math.random());
      setOtherCustomersBought(shuffled.filter(p => p.id !== foundProduct.id).slice(0, 4));


    } else {
      toast({ title: "Producto no encontrado", description: "Este producto ya no está disponible o la URL es incorrecta.", variant: "destructive" });
      navigate('/catalogo');
    }
  }, [productId, productsToUse, navigate, productsLoading]);

  useEffect(() => {
    if (product) {
      setIsFavorite(favorites.includes(product.id));
    }
  }, [product, favorites]);

  const symbols = { USD: '$', EUR: '€', GBP: '£', DOP: 'RD$' };
  const currentSymbol = symbols[currency] || '$';

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) {
        toast({ title: "Stock Límite", description: `Solo quedan ${product.stock} unidades.`, variant: "destructive" });
        return product.stock;
      }
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
    if (product.category === 'fashion' && availableSizes.length > 0 && !selectedSize) {
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
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `¡Mira este increíble producto en ${storeName}: ${product.name}!`,
        url: window.location.href,
      })
      .then(() => toast({title: "¡Producto compartido!", description:"Gracias por compartir."}))
      .catch((error) => console.log('Error al compartir', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({title: "¡Enlace copiado!", description:"El enlace al producto ha sido copiado al portapapeles."});
    }
  };


  if (productsLoading || !product) { 
    return (
      <div className="container mx-auto max-w-5xl py-8 sm:py-12 px-4">
        <Skeleton className="h-10 w-24 mb-8" />
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const availableSizes = product.category === 'fashion' && product.availableSizes && product.availableSizes.length > 0 
    ? product.availableSizes 
    : product.category === 'fashion' ? ['S', 'M', 'L', 'XL', 'XXL'] : [];
    
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;

  return (
    <>
    <Helmet>
        <title>{`${product.name} - ${storeName}`}</title>
        <meta name="description" content={`${product.description ? product.description.substring(0, 160) : `Descubre ${product.name} en ${storeName}`}. Stock: ${product.stock}. Precio: ${currentSymbol}${product.sellingPrice.toFixed(2)}.`} />
        <meta property="og:title" content={`${product.name} - ${storeName}`} />
        <meta property="og:description" content={product.description ? product.description.substring(0,160) : `Descubre ${product.name}`} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1627577741153-74b82d87607b" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.sellingPrice.toFixed(2)} />
        <meta property="product:price:currency" content={currency} />
    </Helmet>
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
          className="bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border aspect-square overflow-hidden relative"
        >
          <img 
            loading="lazy"
            class="w-full h-full object-contain rounded-lg"
            alt={product.imageDescription || `Imagen de ${product.name}`}
           src="https://images.unsplash.com/photo-1627577741153-74b82d87607b" />
          {product.discountedPrice && (
              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold shadow-md animate-pulse">
                OFERTA
              </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground hover:underline cursor-pointer" onClick={()=>toast({title:"Reseñas (Simulación)", description:"Pronto podrás ver reseñas detalladas aquí."})}>({product.reviews} reseñas)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
                <Tag size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{categoryName}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary my-4 flex items-baseline gap-2">
              <span>{currentSymbol}{product.sellingPrice.toFixed(2)}</span>
              {product.discountedPrice && (
                <span className="text-lg text-muted-foreground line-through">{currentSymbol}{product.discountedPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description || "Descripción no disponible."}</p>
            
            {product.category === 'fashion' && availableSizes.length > 0 && (
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
              {product.stock > 0 ? <span className="text-green-500 font-medium flex items-center"><CheckCircle size={16} className="mr-1.5"/>{product.stock} unidades disponibles</span> : <span className="text-destructive font-medium">Producto Agotado</span>}
            </p>
          </div>

          <div className="space-y-3">
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
             <Button 
              variant="outline" 
              size="lg" 
              onClick={handleShare}
              className="w-full border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground py-3"
            >
              <Share2 className="mr-2 h-5 w-5 text-blue-400" />
              Compartir Producto
            </Button>
          </div>
          {product.supplierUrl && user && user.email === 'jaydenpierre3311@gmail.com' && (
             <a href={product.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-4 block text-center sm:text-left">
                Ver en proveedor (Admin)
            </a>
          )}
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">También podría interesarte...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProd, index) => (
                    <ProductCard key={relatedProd.id} product={relatedProd} index={index} favorites={favorites} toggleFavorite={toggleFavorite} isAdminView={false} isLoading={false} />
                ))}
            </div>
        </div>
      )}

      {otherCustomersBought.length > 0 && (
         <div className="mt-12 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Otros clientes también compraron... (Simulación)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherCustomersBought.map((otherProd, index) => (
                    <ProductCard key={otherProd.id} product={otherProd} index={index} favorites={favorites} toggleFavorite={toggleFavorite} isAdminView={false} isLoading={false} />
                ))}
            </div>
        </div>
      )}


      <div className="mt-12 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Preguntas sobre este producto (Simulación)</h2>
        <p className="text-muted-foreground mb-4">¿Tienes alguna pregunta? ¡Pregúntale a la comunidad o al vendedor!</p>
        <textarea className="w-full p-3 border border-border rounded-lg focus:ring-primary focus:border-primary bg-input text-foreground placeholder-muted-foreground mb-3" rows="3" placeholder="Escribe tu pregunta aquí..."></textarea>
        <Button onClick={() => toast({title: "Pregunta Enviada (Simulación)", description:"Tu pregunta ha sido enviada. Recibirás una respuesta pronto."})} className="btn-gradient-primary text-primary-foreground">
            <MessageSquare className="mr-2 h-4 w-4" /> Enviar Pregunta
        </Button>
      </div>

    </motion.div>
    </>
  );
};

export default ProductDetailPage;
