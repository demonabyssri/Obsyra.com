import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, PlusCircle, Edit3, Trash2, Home, Briefcase, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const AddressFormModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
  const [formData, setFormData] = useState({
    type: 'Casa',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'República Dominicana',
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData(addressToEdit);
    } else {
      setFormData({
        type: 'Casa', name: '', street: '', city: '', state: '', zip: '', country: 'República Dominicana',
      });
    }
  }, [addressToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (!formData.name || !formData.street || !formData.city || !formData.zip || !formData.country) {
      toast({ title: "Campos requeridos", description: "Por favor, completa todos los campos marcados con *.", variant: "destructive" });
      return;
    }
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card text-card-foreground rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </Button>
        <h2 className="text-2xl font-semibold text-foreground mb-6">{addressToEdit ? 'Editar Dirección' : 'Añadir Nueva Dirección'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre del Destinatario*" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Calle y Número*" name="street" value={formData.street} onChange={handleChange} />
          <Input label="Ciudad*" name="city" value={formData.city} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Provincia/Estado" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Código Postal*" name="zip" value={formData.zip} onChange={handleChange} />
          </div>
          <Input label="País*" name="country" value={formData.country} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Dirección</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border border-border rounded-lg focus:ring-primary focus:border-primary bg-input">
              <option value="Casa">Casa</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-border text-muted-foreground">Cancelar</Button>
            <Button type="submit" className="btn-gradient-primary text-primary-foreground">Guardar Dirección</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


const AddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (user) {
      const storedAddresses = JSON.parse(localStorage.getItem(`userAddresses_${user.uid}`) || '[]');
      setAddresses(storedAddresses);
    }
  }, [user]);

  const saveAddressesToStorage = (updatedAddresses) => {
    if (user) {
      localStorage.setItem(`userAddresses_${user.uid}`, JSON.stringify(updatedAddresses));
    }
  };

  const handleSaveAddress = (addressData) => {
    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => addr.id === editingAddress.id ? { ...addr, ...addressData } : addr);
      toast({ title: "Dirección Actualizada" });
    } else {
      const newAddress = { ...addressData, id: Date.now() };
      updatedAddresses = [newAddress, ...addresses];
      if (updatedAddresses.length === 1) { // Set as default if it's the first address
        updatedAddresses[0].isDefault = true;
      }
      toast({ title: "Dirección Añadida" });
    }
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setEditingAddress(null);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    // If deleting the default address, and there are other addresses, make the first one default
    if (addresses.find(a => a.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
    }
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    toast({ title: "Dirección Eliminada", variant: "destructive" });
  };
  
  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({...addr, isDefault: addr.id === addressId }));
    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    toast({ title: "Dirección Predeterminada Actualizada"});
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
                    {address.type === 'Casa' ? <Home className="h-5 w-5 mr-2 text-blue-400"/> : 
                     address.type === 'Trabajo' ? <Briefcase className="h-5 w-5 mr-2 text-green-400"/> :
                     <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    }
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
      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingAddress(null); }} 
        onSave={handleSaveAddress} 
        addressToEdit={editingAddress} 
      />
    </motion.div>
  );
};

export default AddressesPage;