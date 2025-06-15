
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, XCircle } from 'lucide-react';

const CartPage = ({ cart, removeFromCart, updateQuantity, currency }) => {
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const currentSymbol = symbols[currency] || '$';

  const handleCheckoutNavigation = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-3xl py-12 px-4 text-center"
      >
        <ShoppingCart className="mx-auto h-20 w-20 text-primary/70 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Tu Carrito está Vacío</h1>
        <p className="text-muted-foreground mb-8">Parece que no has añadido ningún producto a tu carrito todavía.</p>
        <Button asChild className="btn-gradient-primary text-primary-foreground text-lg py-3 px-6">
          <Link to="/catalogo">Explorar Productos</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-4xl py-8 sm:py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <ShoppingCart className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Tu Carrito de Compras</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                className="bg-card p-4 sm:p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border border-border"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-muted">
                  <img 
                    class="w-full h-full object-cover" 
                    alt={item.imageDescription || `Imagen de ${item.name}`}
                   src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">{item.name}</h2>
                  {item.size && <p className="text-sm text-muted-foreground">Talla: {item.size}</p>}
                  <p className="text-lg font-bold text-primary mt-1 sm:mt-2">{currentSymbol}{item.sellingPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-8 text-center text-card-foreground">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-md sm:text-lg font-bold text-card-foreground w-24 text-center sm:text-right">
                  {currentSymbol}{(item.sellingPrice * item.quantity).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/80 h-9 w-9" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-xl shadow-xl border border-border sticky top-24"
          >
            <h2 className="text-2xl font-semibold text-card-foreground mb-6 border-b border-border pb-4">Resumen del Pedido</h2>
            <div className="space-y-3 mb-6 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} productos):</span>
                <span className="font-medium text-card-foreground">{currentSymbol}{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío Estimado:</span>
                <span className="font-medium text-green-400">GRATIS</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-card-foreground pt-3 border-t border-border mt-3">
                <span>Total:</span>
                <span>{currentSymbol}{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              onClick={handleCheckoutNavigation} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 text-lg rounded-lg pulse-glow"
              disabled={cart.length === 0}
            >
              Proceder al Pago <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Serás redirigido a una página segura para completar tu compra.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="mt-12 text-center">
        <Button variant="outline" asChild className="text-primary border-primary hover:bg-accent hover:text-accent-foreground">
          <Link to="/catalogo">
            <ArrowRight className="mr-2 h-4 w-4 transform rotate-180" /> Continuar Comprando
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default CartPage;
