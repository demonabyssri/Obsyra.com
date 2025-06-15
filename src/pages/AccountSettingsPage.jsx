
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Shield, Palette, CreditCard, KeyRound, Settings as SettingsIconLucide } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { auth, updateProfile as firebaseUpdateProfile, sendPasswordResetEmail } from '@/firebase';
import { useAuth } from '@/hooks/useAuth'; 

const AccountSettingsPage = ({ user, currentTheme, onToggleTheme }) => {
  const { JAYDEN_ADMIN_EMAIL } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleNotImplemented = (feature) => {
    toast({ title: "🚧 ¡Función en desarrollo!", description: `La opción "${feature}" estará disponible pronto.` });
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
            <Button variant="outline" onClick={() => handleNotImplemented("Autenticación de Dos Factores")} className="border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground">Autenticación de Dos Factores (2FA)</Button>
            {user.email !== JAYDEN_ADMIN_EMAIL && (
                <Button variant="link" className="text-destructive hover:text-destructive-foreground/80 p-0" onClick={() => handleNotImplemented("Eliminar Cuenta")}>Eliminar mi cuenta</Button>
            )}
          </div>
        </SettingsSection>

        <SettingsSection title="Preferencias de Notificación" icon={<Bell />}>
            <p className="text-sm text-muted-foreground mb-4">Gestiona cómo te contactamos. (Simulación)</p>
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
            <p className="text-sm text-muted-foreground mb-2">Gestiona tus métodos de pago guardados. (Simulación)</p>
            <Button variant="outline" onClick={() => handleNotImplemented("Añadir Método de Pago")} className="border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground">Añadir Nuevo Método de Pago</Button>
        </SettingsSection>

      </div>
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
