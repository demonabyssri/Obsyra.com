
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingCart, FileText, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const OrderDetailsModal = ({ order, onClose, currencySymbol }) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card text-card-foreground rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </Button>
        <div className="flex items-center mb-6">
          <FileText className="h-7 w-7 text-primary mr-3" />
          <h2 className="text-2xl font-semibold">Detalles del Pedido #{order.id.split('-')[2]}</h2>
        </div>
        <div className="space-y-3 text-sm mb-6">
          <p><strong>Fecha:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${ order.status === 'Entregado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status}</span></p>
          <p><strong>Total Pagado:</strong> <span className="font-bold text-primary">{currencySymbol}{order.totalAmount.toFixed(2)}</span></p>
          <p><strong>Dirección de Envío:</strong> {order.addressLine1}, {order.city}, {order.postalCode}, {order.country}</p>
          <p><strong>Método de Pago:</strong> {order.paymentMethod?.toUpperCase() || 'No especificado'}</p>
        </div>
        <h3 className="font-semibold text-card-foreground mb-3">Artículos:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto border-t border-b border-border py-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm hover:bg-secondary/50 p-1.5 rounded">
              <div>
                <p className="text-card-foreground font-medium">{item.name} (x{item.quantity})</p>
                {item.size && <p className="text-xs text-muted-foreground">Talla: {item.size}</p>}
              </div>
              <span className="text-muted-foreground">{currencySymbol}{(item.sellingPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
         <p className="text-xs text-muted-foreground mt-4 text-center">Esta es una simulación. Los pedidos no son procesados realmente.</p>
      </motion.div>
    </motion.div>
  );
};


const OrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currency } = useStoreSettings();

  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const currentSymbol = symbols[currency] || '$';

  useEffect(() => {
    if (user) {
      const storedOrders = JSON.parse(localStorage.getItem(`userOrders_${user.uid}`) || '[]');
      setOrders(storedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    }
  }, [user]);

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-3xl py-12 px-4 text-center"
      >
        <ShoppingCart className="mx-auto h-20 w-20 text-primary/70 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">No Tienes Pedidos</h1>
        <p className="text-muted-foreground mb-8">Cuando realices una compra, tus pedidos aparecerán aquí.</p>
        <Button asChild className="btn-gradient-primary text-primary-foreground text-lg py-3 px-6">
          <Link to="/catalogo">Empezar a Comprar</Link>
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
        <Package className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Mis Pedidos</h1>
      </div>

      <div className="space-y-8">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border hover:shadow-primary/10 transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Pedido #{order.id.split('-')[2]}</h2>
                <p className="text-sm text-muted-foreground">Realizado el: {new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div className={`text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full mt-2 sm:mt-0 ${
                order.status === 'Entregado' ? 'bg-green-500/20 text-green-400' :
                order.status === 'En Camino' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {order.status}
              </div>
            </div>
            
            <div className="mb-4 text-sm">
                {order.items.slice(0,2).map((item, itemIndex) => (
                    <p key={itemIndex} className="text-muted-foreground truncate">
                        - {item.name} (x{item.quantity})
                    </p>
                ))}
                {order.items.length > 2 && <p className="text-xs text-primary cursor-pointer" onClick={() => setSelectedOrder(order)}>y {order.items.length - 2} más artículos...</p>}
            </div>


            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border">
              <p className="text-md sm:text-lg font-bold text-card-foreground mb-3 sm:mb-0">Total: {currentSymbol}{order.totalAmount.toFixed(2)}</p>
              <Button variant="outline" size="sm" className="border-primary/80 text-primary hover:bg-accent hover:text-accent-foreground" onClick={() => setSelectedOrder(order)}>
                <FileText className="mr-2 h-4 w-4" /> Ver Detalles
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} currencySymbol={currentSymbol} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrdersPage;
