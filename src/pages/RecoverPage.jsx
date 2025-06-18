import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { auth, sendPasswordResetEmail } from '@/firebase';

const RecoverPage = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Correo Requerido",
        description: "Por favor, ingresa tu correo electrónico.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast({
        title: "Correo Enviado",
        description: "Si una cuenta existe para este correo, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).",
      });
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error.code, error.message);
      let errorMessage = "No se pudo enviar el correo de recuperación. Inténtalo de nuevo.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No se encontró ninguna cuenta con este correo electrónico.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Error de configuración de Firebase. Contacta al administrador.";
      }
      toast({
        title: "Error",
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
      <div className="text-center mb-8">
        <KeyRound className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold mt-4 text-foreground">Recuperar Contraseña</h1>
        {!isSent ? (
          <p className="text-muted-foreground mt-2">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
        ) : (
          <p className="text-green-500 mt-2">¡Correo de recuperación enviado! Revisa tu bandeja de entrada (y spam).</p>
        )}
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                id="email"
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
            <Button type="submit" className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 pulse-glow text-base" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <KeyRound className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </Button>
          </div>
        </form>
      ) : (
         <img  alt="Email sent confirmation illustration" class="w-48 h-48 mx-auto my-6" src="https://images.unsplash.com/photo-1556204975-1851fadab092" />
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="font-medium text-primary hover:text-primary/80 hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Iniciar Sesión
        </Link>
      </p>
    </motion.div>
  );
};

export default RecoverPage;