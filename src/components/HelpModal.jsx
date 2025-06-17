
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, HelpCircle, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpModal = ({ isOpen, onClose, contactEmail, storeName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-card text-card-foreground rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary"
            >
              <X size={24} />
            </button>
            <div className="flex items-center justify-center mb-6">
                <HelpCircle className="w-8 h-8 mr-3 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                Centro de Ayuda
                </h2>
            </div>
            
            <div className="space-y-6 text-sm text-muted-foreground">
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">¿Cómo usar {storeName}?</h3>
                <p>¡Bienvenido a {storeName}! Aquí puedes explorar un catálogo de productos variados. Si encuentras algo que te gusta:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
                  <li>Puedes añadirlo a tu <strong className="text-foreground">Lista de Deseos</strong> (icono de corazón) para guardarlo.</li>
                  <li>Para comprar, añade el producto a tu <strong className="text-foreground">Carrito</strong> y procede al pago. Necesitarás completar tus datos de envío.</li>
                  <li>Necesitarás <Link to="/auth/register" onClick={onClose} className="text-primary hover:underline">registrarte</Link> o <Link to="/auth/login" onClick={onClose} className="text-primary hover:underline">iniciar sesión</Link> para comprar y acceder a tu perfil.</li>
                  <li>En tu perfil, podrás ver tus pedidos, lista de deseos y configurar tu cuenta.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">¿Tienes Problemas?</h3>
                <p>Si encuentras algún error, tienes alguna duda o sugerencia, no dudes en contactarnos:</p>
                <div className="mt-3">
                  <a href={`mailto:${contactEmail}`} className="inline-flex items-center text-primary hover:underline font-medium">
                    <Mail className="w-4 h-4 mr-2" /> {contactEmail}
                  </a>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">Enlaces Útiles</h3>
                <ul className="space-y-1 mt-2">
                    <li><Link to="/terminos-y-condiciones" onClick={onClose} className="inline-flex items-center text-primary hover:underline"><ExternalLink size={14} className="mr-1.5"/>Términos y Condiciones</Link></li>
                    <li><Link to="/politica-de-privacidad" onClick={onClose} className="inline-flex items-center text-primary hover:underline"><ExternalLink size={14} className="mr-1.5"/>Política de Privacidad</Link></li>
                </ul>
              </section>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={onClose} className="btn-gradient-primary text-primary-foreground">
                Entendido
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
