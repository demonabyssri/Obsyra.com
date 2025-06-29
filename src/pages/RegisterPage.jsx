import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, AlertTriangle } from 'lucide-react'; 
import { auth, createUserWithEmailAndPassword, updateProfile, firebaseInitializationError } from '@/firebase';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isFirebaseError, setIsFirebaseError] = useState(false);

  useEffect(() => {
    if (firebaseInitializationError) {
      setIsFirebaseError(true);
      toast({
        title: "Error de Configuración de Firebase",
        description: firebaseInitializationError,
        variant: "destructive",
        duration: 10000,
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFirebaseError) {
      toast({
        title: "Error de Configuración",
        description: "No se puede crear la cuenta debido a un problema de configuración de Firebase. Contacta al administrador.",
        variant: "destructive",
      });
      return;
    }

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

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      toast({
        title: "¡Registro Exitoso!",
        description: `Tu cuenta ha sido creada. Ahora puedes iniciar sesión.`,
        duration: 5000,
      });
      navigate('/auth/login');

    } catch (error)
    {
      console.error("Error de registro:", error.code, error.message);
      let errorMessage = "No se pudo crear la cuenta. Inténtalo de nuevo.";
      if (error.message === firebaseInitializationError) {
        errorMessage = firebaseInitializationError;
        setIsFirebaseError(true);
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está en uso.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es demasiado débil.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido.";
      } else if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/configuration-not-found') {
        errorMessage = "Error de configuración de Firebase (API Key inválida o no encontrada). Contacta al administrador.";
        setIsFirebaseError(true);
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
      {isFirebaseError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive-foreground rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Error de configuración de Firebase. El registro está deshabilitado.</span>
        </div>
      )}
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
                  disabled={isFirebaseError}
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
                  disabled={isFirebaseError}
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
                  disabled={isFirebaseError}
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
                  disabled={isFirebaseError}
              />
          </div>
        </div>
        
        <div>
          <Button type="submit" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 pulse-glow text-base" disabled={isLoading || isFirebaseError}>
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