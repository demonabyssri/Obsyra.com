
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Shield, Palette, CreditCard, KeyRound, Settings as SettingsIconLucide, Trash2, ShieldCheck, FileText, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { auth, updateProfile as firebaseUpdateProfile, sendPasswordResetEmail, deleteUser as firebaseDeleteUser } from '@/firebase';
import { useAuth } from '@/hooks/useAuth'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TwoFactorAuthModal from '@/components/TwoFactorAuthModal';

const AccountSettingsPage = ({ user, currentTheme, onToggleTheme }) => {
  const { JAYDEN_ADMIN_EMAIL, logout } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(() => {
    return localStorage.getItem('2fa_enabled_simulated') === 'true';
  });


  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleNotImplemented = (feature) => {
    toast({ title: "🚧 ¡Función en desarrollo!", description: `La opción "${feature}" requiere un backend o está en desarrollo.` });
  };
  
  const handleProfileSave = async () => {
    if (!auth.currentUser) {
        toast({ title: "Error", description: "No estás autenticado.", variant: "destructive"});
        return;
    }
    if (profileData.name.trim() === "") {
        toast({ title: "Nombre Requerido", description: "El nombre no puede estar vacío.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    try {
        await firebaseUpdateProfile(auth.currentUser, {
            displayName: profileData.name
        });
        toast({ title: "Perfil Actualizado", description: "Tu nombre ha sido actualizado." });
    } catch (error) {
        toast({ title: "Error al Actualizar", description: error.message, variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!auth.currentUser || !auth.currentUser.email) {
        toast({ title: "Error", description: "No se pudo obtener tu correo para el cambio de contraseña.", variant: "destructive"});
        return;
    }
    setIsLoadingPassword(true);
    try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        toast({
            title: "Correo de Restablecimiento Enviado",
            description: "Se ha enviado un correo para restablecer tu contraseña a tu dirección de email. Revisa tu bandeja de entrada (y spam)."
        });
    } catch (error) {
        toast({ title: "Error al Enviar Correo", description: error.message, variant: "destructive"});
    } finally {
        setIsLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "No estás autenticado.", variant: "destructive" });
      return;
    }
    setIsDeletingAccount(true);
    try {
      await firebaseDeleteUser(auth.currentUser);
      toast({ title: "Cuenta Eliminada", description: "Tu cuenta ha sido eliminada permanentemente." });
      await logout(); 
    } catch (error) {
      toast({ 
        title: "Error al Eliminar Cuenta", 
        description: `Ocurrió un error: ${error.message}. Es posible que necesites iniciar sesión recientemente para realizar esta acción.`, 
        variant: "destructive",
        duration: 7000 
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleActivateTwoFactor = () => {
    setIsTwoFactorEnabled(true);
    localStorage.setItem('2fa_enabled_simulated', 'true');
    toast({
      title: "¡2FA Activada (Simulación)!",
      description: "La Autenticación de Dos Factores ha sido activada para tu cuenta (simulación).",
      className: "bg-green-500 text-white",
      duration: 5000,
    });
    // Real 2FA activation requires backend.
  };

  const handleDeactivateTwoFactor = () => {
    setIsTwoFactorEnabled(false);
    localStorage.removeItem('2fa_enabled_simulated');
    toast({
      title: "2FA Desactivada (Simulación)",
      description: "La Autenticación de Dos Factores ha sido desactivada.",
      variant: "destructive",
    });
     // Real 2FA deactivation requires backend.
  };


  if (!user) {
    return <div className="text-center py-10 text-muted-foreground">Cargando perfil...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-3xl py-8 sm:py-12 px-4"
    >
      <div className="flex items-center mb-10">
        <SettingsIconLucide className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Configuración de la Cuenta</h1>
      </div>

      <div className="space-y-10">
        <SettingsSection title="Información del Perfil" icon={<User />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre</label>
              <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full p-3 border border-input-border rounded-lg focus:ring-primary focus:border-primary bg-input text-foreground placeholder-muted-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Correo Electrónico</label>
              <input type="email" value={profileData.email} disabled className="w-full p-3 border border-input-border rounded-lg bg-input/50 text-muted-foreground cursor-not-allowed" />
            </div>
            <Button onClick={handleProfileSave} className="btn-gradient-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection title="Seguridad" icon={<Lock />}>
          <div className="space-y-4">
            <Button variant="outline" onClick={handlePasswordChange} className="border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground flex items-center" disabled={isLoadingPassword}>
                {isLoadingPassword ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div> : <KeyRound className="mr-2 h-4 w-4" />}
                {isLoadingPassword ? "Enviando correo..." : "Cambiar Contraseña"}
            </Button>
            
            {!isTwoFactorEnabled ? (
                <Button variant="outline" onClick={() => setIsTwoFactorModalOpen(true)} className="border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground flex items-center">
                    <Shield className="mr-2 h-4 w-4" /> Activar Autenticación de Dos Factores (2FA)
                </Button>
            ) : (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ShieldCheck className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">2FA está ACTIVADA (Simulación)</p>
                        </div>
                        <Button variant="link" onClick={handleDeactivateTwoFactor} className="text-xs text-destructive hover:text-destructive-foreground/80 p-0">
                            Desactivar
                        </Button>
                    </div>
                </div>
            )}

            {user.email !== JAYDEN_ADMIN_EMAIL && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="text-destructive hover:text-destructive-foreground/80 p-0 flex items-center" disabled={isDeletingAccount}>
                    {isDeletingAccount ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mr-2"></div> : <Trash2 className="mr-2 h-4 w-4" />}
                    {isDeletingAccount ? "Eliminando cuenta..." : "Eliminar mi cuenta"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos asociados de nuestros servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeletingAccount}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeletingAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {isDeletingAccount ? "Eliminando..." : "Sí, eliminar cuenta"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SettingsSection>

        <SettingsSection title="Preferencias de Notificación" icon={<Bell />}>
            <p className="text-sm text-muted-foreground mb-4">Gestiona cómo te contactamos. (Notificaciones reales por correo/SMS requieren backend).</p>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-card-foreground">Notificaciones por correo</span>
                    <Button size="sm" variant={notifications.email ? "default" : "outline"} onClick={() => {setNotifications(p => ({...p, email: !p.email})); handleNotImplemented("Notificaciones por correo");}} className={notifications.email ? "btn-gradient-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}>
                        {notifications.email ? "Activadas" : "Desactivadas"}
                    </Button>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-card-foreground">Notificaciones por SMS</span>
                     <Button size="sm" variant={notifications.sms ? "default" : "outline"} onClick={() => {setNotifications(p => ({...p, sms: !p.sms})); handleNotImplemented("Notificaciones por SMS");}} className={notifications.sms ? "btn-gradient-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}>
                        {notifications.sms ? "Activadas" : "Desactivadas"}
                    </Button>
                </div>
            </div>
        </SettingsSection>
        
        <SettingsSection title="Apariencia" icon={<Palette />}>
            <div className="flex items-center space-x-4">
                <span className="text-card-foreground">Tema:</span>
                <Button variant={currentTheme === 'light' ? 'default': 'outline'} onClick={onToggleTheme} className={currentTheme === 'light' ? "btn-gradient-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}>Claro</Button>
                <Button variant={currentTheme === 'dark' ? 'default': 'outline'} onClick={onToggleTheme} className={currentTheme === 'dark' ? "btn-gradient-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}>Oscuro</Button>
            </div>
        </SettingsSection>

        <SettingsSection title="Métodos de Pago" icon={<CreditCard />}>
            <p className="text-sm text-muted-foreground mb-2">Gestiona tus métodos de pago guardados. (Esta función requiere un backend para almacenar datos de pago de forma segura).</p>
            <Button variant="outline" onClick={() => handleNotImplemented("Añadir Método de Pago")} className="border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground">Añadir Nuevo Método de Pago</Button>
        </SettingsSection>

        <SettingsSection title="Mis Datos" icon={<FileText />}>
            <p className="text-sm text-muted-foreground mb-2">Descarga o gestiona tus datos personales. (Requiere backend).</p>
            <div className="space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
                <Button variant="outline" onClick={() => handleNotImplemented("Descargar mis datos")} className="w-full sm:w-auto border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground">Descargar mis Datos</Button>
                <Button variant="outline" onClick={() => handleNotImplemented("Gestionar consentimiento")} className="w-full sm:w-auto border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground">Gestionar Consentimiento</Button>
            </div>
        </SettingsSection>

      </div>
      <TwoFactorAuthModal 
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        onActivate={handleActivateTwoFactor}
      />
    </motion.div>
  );
};

const SettingsSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border"
  >
    <div className="flex items-center mb-6 pb-4 border-b border-border">
      {React.cloneElement(icon, { className: "h-6 w-6 text-primary mr-3 flex-shrink-0" })}
      <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default AccountSettingsPage;
