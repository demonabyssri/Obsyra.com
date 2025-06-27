import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ShieldCheck, QrCode, KeyRound } from 'lucide-react';

const TwoFactorAuthModal = ({ isOpen, onClose, onActivate }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulatedActivation = () => {
    if (verificationCode.length < 6) {
      toast({
        title: "Código Inválido",
        description: "Por favor, ingresa un código de 6 dígitos (simulado).",
        variant: "destructive",
      });
      return;
    }
    setIsSimulating(true);
    setTimeout(() => {
      onActivate();
      setIsSimulating(false);
      onClose();
    }, 1500);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
            Activar Autenticación de Dos Factores (2FA)
          </AlertDialogTitle>
          <AlertDialogDescription className="py-2">
            La 2FA añade una capa extra de seguridad a tu cuenta. Para iniciar sesión, necesitarás tu contraseña y un código de una aplicación de autenticación (como Google Authenticator o Authy).
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Paso 1: Escanea el Código QR</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Usa tu aplicación de autenticación para escanear este código QR. (Esto es una simulación, puedes usar cualquier imagen QR).
            </p>
            <div className="flex justify-center p-4 bg-muted rounded-lg border border-border">
              <img  alt="Simulated QR Code for 2FA" className="w-40 h-40" src="https://images.unsplash.com/photo-1626682561113-d1db402cc866" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">Paso 2: Ingresa el Código de Verificación</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Ingresa el código de 6 dígitos generado por tu aplicación de autenticación.
            </p>
            <div className="flex items-center border border-input-border rounded-lg focus-within:ring-1 focus-within:ring-primary">
              <KeyRound className="h-5 w-5 text-muted-foreground mx-3"/>
              <input 
                type="text"
                maxLength="6"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full p-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none tracking-widest text-center font-mono text-lg"
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isSimulating}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSimulatedActivation} disabled={isSimulating || verificationCode.length < 6} className="btn-gradient-primary text-primary-foreground">
            {isSimulating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
            ) : <ShieldCheck className="mr-2 h-4 w-4" />}
            {isSimulating ? "Activando..." : "Verificar y Activar 2FA"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TwoFactorAuthModal;