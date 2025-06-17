
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, User, MapPin, Phone, Mail, CreditCard as CreditCardIcon, ArrowLeft, Info, ShieldCheck, DollarSign } from 'lucide-react'; 
import { useAuth } from '@/hooks/useAuth';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const CheckoutPage = ({ cart, onPlaceOrder, currency }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { storeName } = useStoreSettings();
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'República Dominicana', 
    phone: '',
    email: '',
    paymentCardName: '',
    paymentCardNumber: '',
    paymentCardExpiry: '',
    paymentCardCvc: '',
    paymentPaypalEmail: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const symbols = { USD: '$', EUR: '€', GBP: '£', DOP: 'RD$' };
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
    
    if (name === 'paymentCardNumber') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0,16) }));
    } else if (name === 'paymentCardExpiry') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0,4) }));
    } else if (name === 'paymentCardCvc') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0,3) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handlePaymentMethodProcessing = (methodName) => {
      toast({
        title: `Procesando con ${methodName} (Simulación)`,
        description: `En un entorno real, aquí se interactuaría con la pasarela de ${methodName} a través de tu backend. No se procesará un pago real.`,
        variant: "default",
        duration: 7000,
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requiredFields = ['fullName', 'addressLine1', 'city', 'postalCode', 'country', 'phone', 'email'];
    for (const key of requiredFields) {
      if (formData[key].trim() === '') {
        toast({ title: "Campo Requerido", description: `Por favor, completa el campo "${key.replace(/([A-Z])/g, ' $1')}".`, variant: "destructive" });
        setIsLoading(false);
        return;
      }
    }
    
    if (!paymentMethod) {
        toast({ title: "Método de Pago Requerido", description: "Por favor, selecciona un método de pago.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    if (paymentMethod === 'card') {
        const cardFields = ['paymentCardName', 'paymentCardNumber', 'paymentCardExpiry', 'paymentCardCvc'];
        for (const key of cardFields) {
            if (formData[key].trim() === '') {
                toast({ title: "Datos de Tarjeta Requeridos", description: `Por favor, completa el campo "${key.replace(/([A-Z])/g, ' $1')}".`, variant: "destructive" });
                setIsLoading(false);
                return;
            }
        }
         handlePaymentMethodProcessing("Tarjeta de Crédito/Débito");
    }
    
    if (paymentMethod === 'paypal' && formData.paymentPaypalEmail.trim() === '') {
        toast({ title: "Correo de PayPal Requerido", description: "Por favor, ingresa tu correo de PayPal.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
     if (paymentMethod === 'paypal') {
        handlePaymentMethodProcessing("PayPal");
    }
    
    if (paymentMethod === 'cash') {
        handlePaymentMethodProcessing("Pago Contra Entrega");
    }


    if (cart.length === 0) {
        toast({ title: "Carrito Vacío", description: "No puedes proceder al pago con un carrito vacío.", variant: "destructive" });
        setIsLoading(false);
        navigate('/catalogo');
        return;
    }

    const orderDetailsForBackend = {
        customerInfo: {
            fullName: formData.fullName,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
        },
        cartItems: cart.map(item => ({ 
            id: item.id, 
            name: item.name, 
            quantity: item.quantity, 
            sellingPrice: item.sellingPrice,
            supplierUrl: item.supplierUrl || 'No especificada',
            size: item.size || null
        })),
        totalAmount: totalPrice,
        currency: currency,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
            cardName: formData.paymentCardName,
        } : paymentMethod === 'paypal' ? {
            paypalEmail: formData.paymentPaypalEmail,
        } : {},
    };
    
    onPlaceOrder(orderDetailsForBackend); 
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    navigate('/perfil/pedidos'); 
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
        <ShieldCheck className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Pago Seguro</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
          <CheckoutSection title="Información de Contacto y Envío" icon={<User />}>
            <FormInput name="fullName" label="Nombre Completo" value={formData.fullName} onChange={handleChange} icon={<User />} />
            <FormInput name="email" type="email" label="Correo Electrónico" value={formData.email} onChange={handleChange} icon={<Mail />} />
            <FormInput name="phone" type="tel" label="Teléfono" value={formData.phone} onChange={handleChange} icon={<Phone />} />
            <FormInput name="addressLine1" label="Dirección Línea 1" value={formData.addressLine1} onChange={handleChange} icon={<MapPin />} />
            <FormInput name="addressLine2" label="Dirección Línea 2 (Opcional)" value={formData.addressLine2} onChange={handleChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput name="city" label="Ciudad" value={formData.city} onChange={handleChange} />
              <FormInput name="postalCode" label="Código Postal" value={formData.postalCode} onChange={handleChange} />
            </div>
            <FormInput name="country" label="País" value={formData.country} onChange={handleChange} />
          </CheckoutSection>

          <CheckoutSection title="Método de Pago" icon={<CreditCardIcon />}>
             <div className="p-3 bg-secondary/50 border border-border rounded-md text-xs text-muted-foreground flex items-start space-x-2">
                <Info size={24} className="text-primary flex-shrink-0 mt-0.5"/>
                <span>
                    <strong>Importante:</strong> {storeName} actúa como intermediario. Al completar tu pedido, el administrador utilizará tus datos para realizar la compra en tu nombre directamente con los proveedores y coordinará el envío. Los datos de pago aquí son para este proceso.
                </span>
             </div>
            <div className="space-y-3 mt-4">
              <PaymentOption 
                id="card" 
                name="paymentMethod" 
                value="card" 
                label="Tarjeta de Crédito/Débito" 
                checked={paymentMethod === 'card'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                icon={<CreditCardIcon className="h-6 w-6 text-blue-500"/>}
              />
              {paymentMethod === 'card' && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="pl-8 space-y-3 pt-2">
                    <FormInput name="paymentCardName" label="Nombre en la Tarjeta" value={formData.paymentCardName} onChange={handleChange}/>
                    <FormInput name="paymentCardNumber" label="Número de Tarjeta" value={formData.paymentCardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••"/>
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput name="paymentCardExpiry" label="Expiración (MMYY)" value={formData.paymentCardExpiry} onChange={handleChange} placeholder="MMYY"/>
                        <FormInput name="paymentCardCvc" label="CVC" value={formData.paymentCardCvc} onChange={handleChange} placeholder="•••"/>
                    </div>
                </motion.div>
              )}
              <PaymentOption 
                id="paypal" 
                name="paymentMethod" 
                value="paypal" 
                label="PayPal" 
                checked={paymentMethod === 'paypal'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                icon={<img  alt="PayPal Logo" class="h-6" src="https://www.paypalobjects.com/images/logos/paypal_logo_color_100x26.png" />}
              />
              {paymentMethod === 'paypal' && (
                 <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="pl-8 pt-2">
                    <FormInput name="paymentPaypalEmail" type="email" label="Correo Electrónico de PayPal" value={formData.paymentPaypalEmail} onChange={handleChange} icon={<Mail />} />
                 </motion.div>
              )}
               <PaymentOption 
                id="cash" 
                name="paymentMethod" 
                value="cash" 
                label="Pago Contra Entrega (Simulación)" 
                checked={paymentMethod === 'cash'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                icon={<DollarSign className="h-6 w-6 text-green-500"/>}
              />
            </div>
             <p className="text-xs text-muted-foreground mt-4">Al continuar, aceptas nuestros <Link to="/terminos-y-condiciones" className="underline hover:text-primary">Términos y Condiciones</Link>.</p>
          </CheckoutSection>
          
          <Button type="submit" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 text-lg rounded-lg transition-all duration-300 pulse-glow" disabled={isLoading || cart.length === 0}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
            ) : (
              <ShieldCheck className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Procesando..." : `Confirmar Pedido y Pagar ${currentSymbol}${totalPrice.toFixed(2)}`}
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
        required={name !== 'addressLine2' && !name.startsWith('payment')} 
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
