
import React from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, KeyRound } from 'lucide-react';

const LOGO_URL_AUTH = "https://storage.googleapis.com/hostinger-horizons-assets-prod/1bb53093-bd34-438d-a3a0-b0ab127eeaa2/11ed8307a9d51978635024a70fb0e56a.jpg";


const AuthLayout = () => {
  const location = useLocation();

  const getNavTitle = () => {
    if (location.pathname.includes('/login')) return "Iniciar Sesión";
    if (location.pathname.includes('/register')) return "Crear Cuenta";
    if (location.pathname.includes('/recover')) return "Recuperar Contraseña";
    return "Autenticación";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all duration-300 overflow-hidden">
                <img src={LOGO_URL_AUTH} alt="Phantom Deals Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold gradient-text-brand group-hover:opacity-80 transition-opacity">
                Phantom Deals
            </span>
        </Link>
        <p className="text-muted-foreground">{getNavTitle()}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md bg-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-border"
      >
        <nav className="mb-8">
          <ul className="flex justify-center border-b border-border">
            <AuthNavLink to="/auth/login" icon={<LogIn />}>Login</AuthNavLink>
            <AuthNavLink to="/auth/register" icon={<UserPlus />}>Registro</AuthNavLink>
            <AuthNavLink to="/auth/recover" icon={<KeyRound />}>Recuperar</AuthNavLink>
          </ul>
        </nav>
        <Outlet />
      </motion.div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Phantom Deals. Todos los derechos reservados.
      </p>
    </div>
  );
};

const AuthNavLink = ({ to, children, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex-1 py-3 px-2 text-center text-sm font-medium border-b-2 transition-colors duration-300 flex items-center justify-center space-x-2
      ${isActive 
        ? 'border-primary text-primary' 
        : 'border-transparent text-muted-foreground hover:text-primary hover:border-primary/50'
      }`
    }
  >
    {React.cloneElement(icon, {className: 'h-4 w-4'})}
    <span>{children}</span>
  </NavLink>
);

export default AuthLayout;
