import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signOut as firebaseSignOut } from '@/firebase';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const JAYDEN_ADMIN_EMAIL = "jaydenpierre3311@gmail.com";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.onAuthStateChanged) {
      console.error("Firebase auth no está disponible. La autenticación no funcionará.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setIsAdmin(firebaseUser.email === JAYDEN_ADMIN_EMAIL);
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('currentUser');
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error en onAuthStateChanged:", error);
      toast({
        title: "Error de Autenticación",
        description: "Hubo un problema al verificar tu estado de sesión. Intenta recargar la página.",
        variant: "destructive",
      });
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth || !auth.signOut) {
      toast({ title: "Error", description: "No se puede cerrar sesión, Firebase no está configurado.", variant: "destructive" });
      return;
    }
    try {
      await firebaseSignOut(auth);
      toast({ title: "¡Sesión cerrada!", description: "Has cerrado sesión correctamente." });
      navigate('/'); 
    } catch (error) {
      toast({ title: "Error al cerrar sesión", description: error.message, variant: "destructive" });
    }
  };

  return { user, isAdmin, isLoading, logout, JAYDEN_ADMIN_EMAIL };
};