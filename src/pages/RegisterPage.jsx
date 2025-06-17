
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, CreditCard as CreditCardIcon } from 'lucide-react'; 
import { auth, createUserWithEmailAndPassword, updateProfile } from '@/firebase';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiryDate: '', cvc: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0,16);
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0,4);
      if(formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0,2)}/${formattedValue.slice(2)}`;
      }
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0,3);
    }
    setPaymentData(prev => ({...prev, [name]: formattedValue}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Campos incompletos", description: "Por favor, completa todos los campos de registro.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error de contraseña", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Contraseña Débil", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }

    let paymentInfoMessage = "";
    if (showPaymentFields) {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvc) {
            toast({ title: "Datos de Pago Incompletos", description: "Por favor, completa los datos de pago o desmarca la opción.", variant: "destructive" });
            return;
        }
        // No procesar, solo simular recolección
        paymentInfoMessage = " Los datos de pago opcionales (simulados) se han recopilado. En un sistema real, estos se tokenizarían y enviarían de forma segura a un backend para su almacenamiento y uso futuro.";
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      if (showPaymentFields) {
          console.log("Datos de pago (simulados) para nuevo usuario:", paymentData);
      }

      toast({
        title: "¡Registro Exitoso!",
        description: `Tu cuenta ha sido creada.${paymentInfoMessage}`,
        duration: paymentInfoMessage ? 7000 : 5000,
      });
      navigate('/auth/login');

    } catch (error)
    {
      console.error("Error de registro:", error.code, error.message);
      let errorMessage = "No se pudo crear la cuenta. Inténtalo de nuevo.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está en uso.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es demasiado débil.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Error de configuración de Firebase. Contacta al administrador.";
      }
      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-muted-foreground mb-1">
            Nombre Completo
          </label>
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                  id="name-register"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 border border-border rounded-lg focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70"
                  placeholder="Tu Nombre Completo"
              />
          </div>
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-muted-foreground mb-1">
            Correo Electrónico
          </label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                  id="email-register"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-border rounded-lg focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70"
                  placeholder="tu@ejemplo.com"
              />
          </div>
        </div>

        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-muted-foreground mb-1">
            Contraseña
          </label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                  id="password-register"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 border border-border rounded-lg focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70"
                  placeholder="Mínimo 6 caracteres"
              />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword-register" className="block text-sm font-medium text-muted-foreground mb-1">
            Confirmar Contraseña
          </label>
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                  id="confirmPassword-register"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 p-3 border border-border rounded-lg focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70"
                  placeholder="Confirma tu contraseña"
              />
          </div>
        </div>
        
        <div className="space-y-2">
            <div className="flex items-center">
                <input
                id="showPaymentFields"
                type="checkbox"
                checked={showPaymentFields}
                onChange={(e) => setShowPaymentFields(e.target.checked)}
                className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="showPaymentFields" className="ml-2 block text-sm text-muted-foreground">
                Añadir método de pago (opcional - simulación)
                </label>
            </div>
            {showPaymentFields && (
                <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    className="space-y-3 pt-2 pl-2 border-l-2 border-primary/50"
                >
                    <p className="text-xs text-amber-500 dark:text-amber-400">Atención: Estos campos son para simulación. No ingreses datos reales de tarjetas. El procesamiento real requiere un backend seguro (PCI DSS).</p>
                    <div>
                        <label htmlFor="cardNumber" className="block text-xs font-medium text-muted-foreground">Número de Tarjeta</label>
                        <input type="text" id="cardNumber" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentDataChange} className="mt-1 block w-full p-2 border border-border rounded-md bg-input text-sm" placeholder="•••• •••• •••• ••••"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="expiryDate" className="block text-xs font-medium text-muted-foreground">Expiración (MM/YY)</label>
                            <input type="text" id="expiryDate" name="expiryDate" value={paymentData.expiryDate} onChange={handlePaymentDataChange} className="mt-1 block w-full p-2 border border-border rounded-md bg-input text-sm" placeholder="MM/YY"/>
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-xs font-medium text-muted-foreground">CVC</label>
                            <input type="text" id="cvc" name="cvc" value={paymentData.cvc} onChange={handlePaymentDataChange} className="mt-1 block w-full p-2 border border-border rounded-md bg-input text-sm" placeholder="•••"/>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>


        <div>
          <Button type="submit" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 pulse-glow text-base" disabled={isLoading}>
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
            ) : (
                <UserPlus className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
