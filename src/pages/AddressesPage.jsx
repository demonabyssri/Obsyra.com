
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, PlusCircle, Edit3, Trash2, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const initialAddresses = [
  { id: 1, type: 'Casa', name: 'Juan Pérez', street: 'Calle Falsa 123', city: 'Springfield', state: 'IL', zip: '62704', country: 'EE. UU.', isDefault: true },
  { id: 2, type: 'Trabajo', name: 'Juan Pérez', street: 'Avenida Siempreviva 742', city: 'Springfield', state: 'IL', zip: '62702', country: 'EE. UU.', isDefault: false },
];

const AddressesPage = () => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
    toast({ title: "🚧 Gestión de Direcciones", description: "Esta es una simulación. La funcionalidad completa de añadir/editar direcciones está en desarrollo." });
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
     toast({ title: "🚧 Gestión de Direcciones", description: "Esta es una simulación. La funcionalidad completa de añadir/editar direcciones está en desarrollo." });
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Dirección Eliminada (Simulado)", variant: "destructive" });
  };
  
  const handleSetDefault = (addressId) => {
    setAddresses(prev => prev.map(addr => ({...addr, isDefault: addr.id === addressId })));
    toast({ title: "Dirección Predeterminada Actualizada (Simulado)"});
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-3xl py-8 sm:py-12 px-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
            <MapPin className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Mis Direcciones</h1>
        </div>
        <Button onClick={handleAddNewAddress} className="btn-gradient-primary text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nueva Dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 bg-card rounded-xl shadow-lg p-8 border border-border"
        >
            <MapPin className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <h2 className="text-2xl font-semibold text-card-foreground mb-2">No tienes direcciones guardadas</h2>
            <p className="text-muted-foreground">Añade una dirección para facilitar tus compras.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card p-6 rounded-xl shadow-lg border border-border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    {address.type === 'Casa' ? <Home className="h-5 w-5 mr-2 text-blue-400"/> : <Briefcase className="h-5 w-5 mr-2 text-green-400"/> }
                    <h3 className="text-lg font-semibold text-card-foreground">{address.type}</h3>
                    {address.isDefault && (
                      <span className="ml-3 text-xs bg-primary/20 text-primary font-medium px-2 py-0.5 rounded-full">Predeterminada</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)} className="text-xs">
                    <Edit3 className="mr-1 h-3 w-3" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)} className="text-xs text-destructive hover:text-destructive-foreground hover:bg-destructive/80">
                    <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                  </Button>
                </div>
              </div>
              {!address.isDefault && (
                <Button variant="link" size="sm" onClick={() => handleSetDefault(address.id)} className="mt-3 p-0 text-primary hover:text-primary/80 text-xs">
                    Establecer como predeterminada
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AddressesPage;
