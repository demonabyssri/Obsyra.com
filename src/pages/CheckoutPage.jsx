
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, User, MapPin, Phone, Mail, CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const CheckoutPage = ({ cart, onPlaceOrder, currency }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'EE. UU.', 
    phone: '',
    email: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal'); 
  const [isLoading, setIsLoading] = useState(false);

  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  const currentSymbol = symbols[currency] || '$';

  const totalPrice = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    for (const key in formData) {
      if (formData[key] === '' && key !== 'addressLine2') { 
        toast({ title: "Campo Requerido", description: `Por favor, completa el campo "${key.replace(/([A-Z])/g, ' $1')}".`, variant: "destructive" });
        setIsLoading(false);
        return;
      }
    }
    if (cart.length === 0) {
        toast({ title: "Carrito Vacío", description: "No puedes proceder al pago con un carrito vacío.", variant: "destructive" });
        setIsLoading(false);
        navigate('/catalogo');
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (paymentMethod === 'paypal') {
      toast({
        title: "Redirigiendo a PayPal (Simulación)",
        description: "Serás redirigido a PayPal para completar tu pago.",
        duration: 5000
      });
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      onPlaceOrder({ ...formData, paymentMethod, currency }); // Pasar moneda al pedido
      navigate('/perfil/pedidos'); 
    } else {
      toast({ title: "Método no implementado", description: "Este método de pago aún no está disponible." });
    }
    setIsLoading(false);
  };

  if (cart.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-lg py-12 px-4 text-center"
      >
        <ShoppingCart className="mx-auto h-20 w-20 text-primary/70 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Tu Carrito está Vacío</h1>
        <p className="text-muted-foreground mb-8">Añade productos a tu carrito antes de proceder al pago.</p>
        <Button asChild className="btn-gradient-primary text-primary-foreground text-lg py-3 px-6">
          <Link to="/catalogo">Explorar Catálogo</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-3xl py-8 sm:py-12 px-4"
    >
      <div className="flex items-center mb-10">
        <CreditCard className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Proceso de Pago</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
          <CheckoutSection title="Información de Contacto" icon={<User />}>
            <FormInput name="fullName" label="Nombre Completo" value={formData.fullName} onChange={handleChange} icon={<User />} />
            <FormInput name="email" type="email" label="Correo Electrónico" value={formData.email} onChange={handleChange} icon={<Mail />} />
            <FormInput name="phone" type="tel" label="Teléfono" value={formData.phone} onChange={handleChange} icon={<Phone />} />
          </CheckoutSection>

          <CheckoutSection title="Dirección de Envío" icon={<MapPin />}>
            <FormInput name="addressLine1" label="Dirección Línea 1" value={formData.addressLine1} onChange={handleChange} />
            <FormInput name="addressLine2" label="Dirección Línea 2 (Opcional)" value={formData.addressLine2} onChange={handleChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput name="city" label="Ciudad" value={formData.city} onChange={handleChange} />
              <FormInput name="postalCode" label="Código Postal" value={formData.postalCode} onChange={handleChange} />
            </div>
            <FormInput name="country" label="País" value={formData.country} onChange={handleChange} />
          </CheckoutSection>

          <CheckoutSection title="Método de Pago" icon={<CreditCard />}>
            <div className="space-y-3">
              <PaymentOption 
                id="paypal" 
                name="paymentMethod" 
                value="paypal" 
                label="PayPal" 
                checked={paymentMethod === 'paypal'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                icon={<img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal Logo" className="h-6"/>}
              />
               <PaymentOption 
                id="stripe" 
                name="paymentMethod" 
                value="stripe" 
                label="Tarjeta de Crédito (Stripe - Próximamente)" 
                checked={paymentMethod === 'stripe'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                icon={<CreditCard className="h-6 w-6 text-blue-500"/>}
                disabled={true}
              />
            </div>
             <p className="text-xs text-muted-foreground mt-4">Al continuar, aceptas nuestros <Link to="/terminos-y-condiciones" className="underline hover:text-primary">Términos y Condiciones</Link>.</p>
          </CheckoutSection>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 pulse-glow" disabled={isLoading || cart.length === 0}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <CreditCard className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Procesando Pago..." : `Pagar ${currentSymbol}${totalPrice.toFixed(2)}`}
          </Button>
        </form>

        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-xl shadow-lg border border-border sticky top-24"
          >
            <h2 className="text-2xl font-semibold text-card-foreground mb-6 border-b border-border pb-4">Resumen del Carrito</h2>
            <div className="space-y-3 mb-6 text-muted-foreground max-h-60 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[150px]" title={item.name}>{item.name} (x{item.quantity})</span>
                  <span className="font-medium text-card-foreground">{currentSymbol}{(item.sellingPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-6 text-card-foreground border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} productos):</span>
                <span className="font-medium">{currentSymbol}{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío:</span>
                <span className="font-medium text-green-400">GRATIS</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-foreground pt-2 border-t border-border mt-2">
                <span>Total:</span>
                <span>{currentSymbol}{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button variant="outline" asChild className="w-full text-primary border-primary hover:bg-accent hover:text-accent-foreground">
              <Link to="/carrito">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Carrito
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const CheckoutSection = ({ title, icon, children }) => (
  <div className="mb-6">
    <div className="flex items-center mb-4">
      {React.cloneElement(icon, { className: "h-6 w-6 text-primary mr-3 flex-shrink-0" })}
      <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const FormInput = ({ label, name, type = "text", value, onChange, icon, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: "h-5 w-5 text-muted-foreground/70" })}
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={name !== 'addressLine2'} 
        className={`w-full ${icon ? 'pl-10' : 'pl-3'} p-3 border border-input-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70`}
        {...props}
      />
    </div>
  </div>
);

const PaymentOption = ({ id, name, value, label, checked, onChange, icon, disabled }) => (
  <label 
    htmlFor={id} 
    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
      checked ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <input 
      type="radio" 
      id={id} 
      name={name} 
      value={value} 
      checked={checked} 
      onChange={onChange} 
      className="form-radio h-5 w-5 text-primary focus:ring-primary bg-input border-border"
      disabled={disabled}
    />
    <span className="ml-3 text-sm font-medium text-card-foreground flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </span>
  </label>
);


export default CheckoutPage;
