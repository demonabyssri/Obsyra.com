import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
// import { useProducts } from '@/hooks/useProducts'; // Podrías usarlo para actualizar stock

export const useCart = (user) => { // Pasar user para limpiar carrito al cerrar sesión
  const [cart, setCart] = useState([]);
  // const { updateProductStock } = useProducts(); // Para reducir stock al comprar

  useEffect(() => {
    // Cargar carrito desde localStorage solo si hay un usuario
    if (user) {
      const savedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`) || '[]');
      setCart(savedCart);
    } else {
      setCart([]); // Limpiar carrito si no hay usuario
    }
  }, [user]); // Recargar/limpiar carrito cuando el usuario cambie

  useEffect(() => {
    // Guardar carrito en localStorage asociado al UID del usuario
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
    } else if (user && cart.length === 0) {
      localStorage.removeItem(`cart_${user.uid}`); // Limpiar si el carrito está vacío
    }
  }, [cart, user]);

  const addToCart = (productToAdd) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === productToAdd.id);
      if (existingProduct) {
        if (existingProduct.quantity < productToAdd.stock) {
          return prevCart.map(item =>
            item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast({ title: "Stock Límite", description: `No puedes añadir más de ${productToAdd.name} (stock disponible: ${productToAdd.stock}).`, variant: "destructive" });
          return prevCart;
        }
      } else {
        if (1 <= productToAdd.stock) {
          return [...prevCart, { ...productToAdd, quantity: 1 }];
        } else {
          toast({ title: "Sin Stock", description: `${productToAdd.name} está agotado.`, variant: "destructive" });
          return prevCart;
        }
      }
    });
    const existingProduct = cart.find(item => item.id === productToAdd.id);
    if (!existingProduct || (existingProduct && existingProduct.quantity < productToAdd.stock)) {
      toast({
        title: "¡Añadido al carrito!",
        description: `${productToAdd.name} ha sido añadido a tu carrito.`,
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tu carrito.",
      variant: "destructive"
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const productInCart = cart.find(item => item.id === productId);
    // Necesitaríamos acceso a los productos originales para verificar el stock aquí
    // Por simplicidad, asumimos que el stock se verifica en `addToCart` y que `productInCart` tiene el stock.
    // Para una solución robusta, el stock original debería venir de `useProducts`.

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (productInCart && newQuantity > productInCart.stock) {
      toast({ title: "Stock Límite", description: `Solo hay ${productInCart.stock} unidades disponibles de ${productInCart.name}.`, variant: "destructive" });
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: productInCart.stock } : item
        )
      );
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
    if(user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  // Función para ser llamada después de que un pedido se procesa exitosamente
  // const handleSuccessfulOrder = () => {
  //   cart.forEach(item => {
  //     updateProductStock(item.id, item.quantity); // Actualizar stock de productos
  //   });
  //   setCart([]); // Limpiar el carrito
  // };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
};