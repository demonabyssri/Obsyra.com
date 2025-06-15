
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Mail, Lock, LogIn as LogInIconLucide } from 'lucide-react';
import { auth, signInWithEmailAndPassword } from '@/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa tu correo y contraseña.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: `Bienvenido de nuevo, ${userCredential.user.displayName || userCredential.user.email}!`,
      });
      navigate('/catalogo'); 
      
    } catch (error) {
      console.error("Error de inicio de sesión:", error.code, error.message);
      let errorMessage = "Correo o contraseña incorrectos. Inténtalo de nuevo.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Error de configuración de Firebase. Contacta al administrador.";
        console.error("Firebase Auth (auth/configuration-not-found): Asegúrate de que la autenticación por Email/Password esté habilitada en tu Firebase Console y que la configuración del proyecto sea correcta.");
      } else if (error.message.includes("project-id")) {
         errorMessage = "Error de configuración de Firebase. Verifica el Project ID.";
      }

      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-muted-foreground mb-1">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground/70" />
            </div>
            <input
              id="email-login"
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
          <label htmlFor="password-login" className="block text-sm font-medium text-muted-foreground mb-1">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground/70" />
            </div>
            <input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 border border-border rounded-lg focus:ring-primary focus:border-primary transition bg-input text-foreground placeholder-muted-foreground/70"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 pulse-glow text-base" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
            ) : (
              <LogInIconLucide className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginPage;
