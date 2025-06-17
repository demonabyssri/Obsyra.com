
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Skeleton } from '@/components/ui/skeleton';


const ProductCard = ({ product, index, favorites, toggleFavorite, isAdminView, isLoading }) => {
  const { currency } = useStoreSettings();

  const getPrice = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    const symbols = { USD: '$', EUR: '€', GBP: '£', DOP: 'RD$' };
    return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
  };
  
  const profit = (product && typeof product.sellingPrice === 'number' && typeof product.originalPrice === 'number') 
    ? product.sellingPrice - product.originalPrice 
    : 0;


  const handleAdminViewDetails = () => {
    if (!product) return;
    toast({
        title: "Detalles del Producto (Admin)",
        description: (
            <div className="text-sm text-popover-foreground">
                <p><strong>Nombre:</strong> {product.name}</p>
                <p><strong>Costo Proveedor:</strong> {getPrice(product.originalPrice)}</p>
                <p><strong>Precio Venta:</strong> {getPrice(product.sellingPrice)}</p>
                {product.discountedPrice && <p><strong>Precio Antes Desc:</strong> {getPrice(product.discountedPrice)}</p>}
                <p><strong>Ganancia Estimada:</strong> {getPrice(profit)}</p>
                <p><strong>Proveedor:</strong> {product.supplierName || 'N/A'}</p>
                {product.supplierUrl && <p><strong>URL Proveedor:</strong> <a href={product.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver producto</a></p>}
                <p><strong>Stock:</strong> {product.stock}</p>
            </div>
        ),
        duration: 10000,
    });
  };

  if (isLoading) {
    return (
      <div className="product-card group flex flex-col">
        <Skeleton className="aspect-square w-full mb-4 sm:mb-5 rounded-xl" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (!product) return null;


  return (
    <motion.div
      key={product.id}
      className="product-card group flex flex-col" 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: "0 12px 25px -8px hsla(var(--primary), 0.15)" }}
    >
      <div className="flex-grow">
        <div className="relative mb-4 sm:mb-5 rounded-xl overflow-hidden aspect-square bg-muted">
            <Link to={`/producto/${product.id}`}>
                <img  
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt={product.imageDescription || `Imagen de ${product.name}`}
                 src="https://images.unsplash.com/photo-1627577741153-74b82d87607b" />
            </Link>
            <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
            className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-accent/20 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label={favorites.includes(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
            <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                favorites.includes(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
            />
            </button>
            {isAdminView && (
            <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-2 right-2 z-10 h-7 w-7 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm border-none rounded-md"
                onClick={(e) => {e.stopPropagation(); handleAdminViewDetails();}}
                title="Ver detalles de administrador"
            >
                <Info className="h-3.5 w-3.5" />
            </Button>
            )}
             {product.discountedPrice && (
              <div className="absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-md bg-red-500 text-white text-xs font-semibold shadow-md">
                OFERTA
              </div>
            )}
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <Link to={`/producto/${product.id}`} className="block">
            <h3 className="text-base sm:text-lg font-semibold text-card-foreground hover:text-primary transition-colors truncate" title={product.name}>{product.name}</h3>
          </Link>
          {product.description && !isAdminView && <p className="text-muted-foreground text-xs line-clamp-2">{product.description}</p>}

          {!isAdminView && (
            <div className="flex items-center space-x-1">
                <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                    key={i}
                    className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                    />
                ))}
                </div>
                <span className="text-[11px] text-muted-foreground">
                {product.rating} ({product.reviews} reseñas)
                </span>
            </div>
          )}
        
          {isAdminView ? (
            <div className="bg-secondary/50 rounded-lg p-2 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Costo:</span>
                    <span className="font-medium text-card-foreground">{getPrice(product.originalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-card-foreground">Venta:</span>
                    <span className="font-semibold text-primary">{getPrice(product.sellingPrice)}</span>
                </div>
                {product.discountedPrice && (
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground line-through">Antes:</span>
                        <span className="font-medium text-muted-foreground line-through">{getPrice(product.discountedPrice)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center border-t border-border pt-1 mt-1">
                    <span className="font-medium text-green-500">Ganancia:</span>
                    <span className="font-bold text-green-500">+{getPrice(profit > 0 ? profit : 0)}</span>
                </div>
            </div>
          ) : (
             <div className="text-xl sm:text-2xl font-bold text-primary flex items-baseline gap-2">
                <span>{getPrice(product.sellingPrice)}</span>
                {product.discountedPrice && (
                    <span className="text-sm text-muted-foreground line-through">{getPrice(product.discountedPrice)}</span>
                )}
            </div>
          )}


          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            {isAdminView && <span className="truncate max-w-[100px]">Prov: {product.supplierName || 'N/A'}</span>}
            <span className={`px-1.5 py-0.5 rounded-full ${
              product.stock > 10 ? "bg-green-500/10 text-green-500" : product.stock > 0 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
            }`}>
              Stock: {product.stock > 0 ? product.stock : 'Agotado'}
            </span>
          </div>
        </div>
      </div>

      <Button
        asChild
        disabled={product.stock === 0 && !isAdminView}
        className="w-full btn-gradient-primary text-primary-foreground font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-300 mt-auto text-sm group"
      >
        <Link to={`/producto/${product.id}`}>
          {product.stock === 0 && !isAdminView ? (
            "Producto Agotado"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Ver Detalles
            </>
          )}
        </Link>
      </Button>
    </motion.div>
  );
};

export default ProductCard;
