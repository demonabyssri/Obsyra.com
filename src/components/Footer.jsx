import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Footer = ({ storeName, logoUrl, currency, setCurrency }) => {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'Dólar USA' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
  ];

  const selectedCurrencyObj = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <footer className="bg-card text-muted-foreground py-10 px-4 border-t border-border mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-background/10 p-1">
                <img src={logoUrl} alt={`${storeName} Logo`} className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">{storeName}</span>
            </div>
            <p className="text-sm">
              Explora lo enigmático. Descubre lo extraordinario. {storeName}, donde el misterio se encuentra con el estilo.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link to="/perfil/pedidos" className="hover:text-primary transition-colors">Mis Pedidos</Link></li>
              <li><Link to="/perfil/lista-deseos" className="hover:text-primary transition-colors">Lista de Deseos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/soporte" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
              <li><Link to="/terminos-y-condiciones" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/politica-de-privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="mb-4 sm:mb-0">© {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary">
                {selectedCurrencyObj.symbol} {selectedCurrencyObj.code}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
              {currencies.map((curr) => (
                <DropdownMenuItem key={curr.code} onSelect={() => setCurrency(curr.code)} className="cursor-pointer hover:!bg-accent/20 focus:!bg-accent/20">
                  {curr.symbol} {curr.name} ({curr.code})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
};

export default Footer;