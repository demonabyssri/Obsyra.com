
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Edit3, ShoppingBag, Heart, Settings, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const UserProfilePage = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto text-center py-20">
        <p className="text-muted-foreground">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }
  
  const handleNotImplemented = (feature) => {
    toast({
        title: "🚧 ¡Función en camino!",
        description: `La sección "${feature}" estará disponible pronto.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-3xl py-12 px-4"
    >
      <div className="bg-card p-8 rounded-xl shadow-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 pb-8 border-b border-border">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-primary-foreground text-5xl font-semibold shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={60} />}
            </div>
            <Button variant="outline" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background shadow-md border-border hover:bg-accent" onClick={() => handleNotImplemented("Editar Foto")}>
                <Edit3 className="h-4 w-4 text-primary"/>
            </Button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">{user.name || 'Usuario'}</h1>
            <p className="text-muted-foreground mt-1">{user.email}</p>
            <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-accent hover:text-accent-foreground" onClick={() => navigate('/perfil/configuracion')}>
                <Edit3 className="mr-2 h-4 w-4"/> Editar Perfil
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileSection title="Mis Pedidos" icon={<ShoppingBag className="h-6 w-6 text-primary"/>} onClick={() => navigate('/perfil/pedidos')} description="Ver historial de compras." />
          <ProfileSection title="Lista de Deseos" icon={<Heart className="h-6 w-6 text-red-500"/>} onClick={() => navigate('/perfil/lista-deseos')} description="Tus productos favoritos." />
          <ProfileSection title="Direcciones" icon={<MapPin className="h-6 w-6 text-blue-400"/>} onClick={() => navigate('/perfil/direcciones')} description="Gestionar direcciones de envío." />
          <ProfileSection title="Configuración" icon={<Settings className="h-6 w-6 text-muted-foreground"/>} onClick={() => navigate('/perfil/configuracion')} description="Privacidad y seguridad." />
        </div>
      </div>
    </motion.div>
  );
};

const ProfileSection = ({ title, icon, onClick, description }) => (
    <motion.div 
        className="bg-secondary/30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border hover:border-primary/50"
        onClick={onClick}
        whileHover={{ y: -5 }}
    >
        <div className="flex items-center mb-2">
            {icon}
            <h2 className="text-xl font-semibold text-card-foreground ml-3">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
);

export default UserProfilePage;
