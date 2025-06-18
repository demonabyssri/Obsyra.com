import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  if (!user) {
    toast({
      title: "Acceso Restringido",
      description: "Debes iniciar sesión para acceder a esta página.",
      variant: "destructive",
      duration: 3000,
    });
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  if (!user || !isAdmin) {
    toast({
      title: "Acceso Denegado",
      description: "No tienes permisos de administrador para acceder aquí.",
      variant: "destructive",
      duration: 3000,
    });
    return <Navigate to="/" replace />;
  }

  return children;
};