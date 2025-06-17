
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
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
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
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
