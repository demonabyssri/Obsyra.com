
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, UserCircle, LogOut, Settings, LayoutDashboard, Heart, Package as PackageIcon, HelpCircle, Search as SearchIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { useStoreSettings } from '@/hooks/useStoreSettings';


const LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/1bb53093-bd34-438d-a3a0-b0ab127eeaa2/11ed8307a9d51978635024a70fb0e56a.jpg";

const Header = ({ cartItemCount, onHelpClick, currentTheme, onToggleTheme }) => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { storeName } = useStoreSettings();


  const handleProfileNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-background/90 backdrop-blur-lg sticky top-0 z-50 border-b border-border text-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={LOGO_URL} alt={`${storeName} Logo`} className="w-full h-full object-contain" />
            </motion.div>
            <span className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
              {storeName}
            </span>
          </Link>

          <div className="flex-1 px-4 lg:px-8 hidden md:block">
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Buscar en Phantom Deals..."
                    className="w-full max-w-lg mx-auto pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    onFocus={() => navigate('/catalogo')}
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>


          <nav className="flex items-center space-x-1 sm:space-x-2">
             <Button variant="ghost" onClick={onHelpClick} className="text-muted-foreground hover:text-primary p-2 hidden sm:inline-flex">
                <HelpCircle className="h-5 w-5 mr-1" /> Ayuda
            </Button>

            <Button variant="ghost" onClick={onToggleTheme} className="text-muted-foreground hover:text-primary p-2">
              {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" onClick={() => user ? navigate('/carrito') : navigate('/auth/login')} className="p-2 relative text-primary hover:text-primary hover:bg-accent/10">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow">
                        {cartItemCount}
                    </span>
                )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:h-10 rounded-full p-0 hover:bg-accent/10">
                     <div className="w-full h-full bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md ring-2 ring-background group-hover:ring-primary/50 transition-all">
                        {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={24}/> }
                     </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-popover border-border text-popover-foreground mt-2 shadow-2xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 py-1">
                      <p className="text-sm font-medium leading-none text-foreground">{user.name || "Usuario"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  
                  {isAdmin ? (
                     <DropdownMenuItem onClick={() => handleProfileNavigation('/admin')} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20 py-2">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                        <span>Panel Admin</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleProfileNavigation('/perfil')} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20 py-2">
                        <UserCircle className="mr-2 h-4 w-4 text-primary" />
                        <span>Mi Perfil</span>
                    </DropdownMenuItem>
                  )}

                  {!isAdmin && (
                    <>
                        <DropdownMenuItem onClick={() => handleProfileNavigation('/perfil/pedidos')} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20 py-2">
                            <PackageIcon className="mr-2 h-4 w-4 text-primary" />
                            <span>Mis Pedidos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProfileNavigation('/perfil/lista-deseos')} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20 py-2">
                            <Heart className="mr-2 h-4 w-4 text-primary" />
                            <span>Lista de Deseos</span>
                        </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleProfileNavigation('/perfil/configuracion')} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20 py-2">
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                   <Button variant="ghost" onClick={onHelpClick} className="w-full justify-start text-popover-foreground hover:bg-accent/20 focus:bg-accent/20 px-2 py-2 text-sm md:hidden">
                      <HelpCircle className="mr-2 h-4 w-4 text-primary" /> Ayuda
                    </Button>
                  <DropdownMenuSeparator className="bg-border"/>
                  <DropdownMenuItem onClick={logout} className="text-destructive hover:!text-destructive hover:!bg-destructive/10 focus:!bg-destructive/10 cursor-pointer py-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild className="btn-gradient-primary text-primary-foreground">
                  <Link to="/auth/register">Registrarse</Link>
                </Button>
                 <Button variant="ghost" onClick={() => navigate('/auth/login')} className="sm:hidden p-2 text-primary hover:text-primary hover:bg-accent/10">
                    <UserCircle className="h-6 w-6" />
                 </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
