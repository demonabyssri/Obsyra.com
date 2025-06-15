
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';


const ProductCard = ({ product, index, favorites, toggleFavorite, isAdminView }) => {
  const profit = product.sellingPrice - product.originalPrice;
  const { currency } = useStoreSettings();

  const getPrice = (amount) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£' };
    return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
  };

  const handleAdminViewDetails = () => {
    toast({
        title: "Detalles del Producto (Admin)",
        description: (
            <div className="text-sm text-popover-foreground">
                <p><strong>Nombre:</strong> {product.name}</p>
                <p><strong>Costo Proveedor:</strong> {getPrice(product.originalPrice)}</p>
                <p><strong>Precio Venta:</strong> {getPrice(product.sellingPrice)}</p>
                <p><strong>Ganancia Estimada:</strong> {getPrice(profit)}</p>
                <p><strong>Proveedor:</strong> {product.supplierName || 'N/A'}</p>
                {product.supplierUrl && <p><strong>URL Proveedor:</strong> <a href={product.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver producto</a></p>}
                <p><strong>Stock:</strong> {product.stock}</p>
            </div>
        ),
        duration: 10000,
    });
  };


  return (
    <motion.div
      key={product.id}
      className="product-card group flex flex-col" 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: "0 12px 25px -8px hsla(var(--phantom-blue-accent), 0.2)" }}
    >
      <div className="flex-grow">
        <div className="relative mb-4 sm:mb-5 rounded-xl overflow-hidden aspect-square bg-muted">
            <Link to={`/producto/${product.id}`}>
                <img 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt={product.imageDescription || `Imagen de ${product.name}`}
                 src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
            </Link>
            <button
            onClick={() => toggleFavorite(product.id)}
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
                onClick={handleAdminViewDetails}
                title="Ver detalles de administrador"
            >
                <Eye className="h-3.5 w-3.5" />
            </Button>
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
                <div className="flex justify-between items-center border-t border-border pt-1 mt-1">
                    <span className="font-medium text-green-500">Ganancia:</span>
                    <span className="font-bold text-green-500">+{getPrice(profit > 0 ? profit : 0)}</span>
                </div>
            </div>
          ) : (
             <div className="text-xl sm:text-2xl font-bold text-primary">{getPrice(product.sellingPrice)}</div>
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
