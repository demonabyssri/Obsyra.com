import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Mail, ChevronLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const SupportPage = () => {
  const navigate = useNavigate();
  const contactEmail = "jaydenpierre3311@gmail.com";
  const { storeName } = useStoreSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-3xl py-8 sm:py-12 px-4"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-8 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground">
        <ChevronLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <div className="flex items-center mb-10">
        <LifeBuoy className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Centro de Soporte</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-6">
        <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">¿Necesitas Ayuda?</h2>
            <p>Estamos aquí para asistirte. Si tienes alguna pregunta sobre cómo usar {storeName}, encuentras algún problema técnico, o tienes alguna sugerencia, por favor contáctanos.</p>
        </section>

        <section>
            <h3 className="text-xl font-semibold text-foreground mb-2">Preguntas Frecuentes</h3>
            <div className="space-y-2">
                <div>
                    <p className="font-medium text-card-foreground">¿Cómo creo una cuenta?</p>
                    <p>Puedes registrarte haciendo clic en el botón "Registrarse" en la parte superior y completando el formulario.</p>
                </div>
                <div>
                    <p className="font-medium text-card-foreground">¿Cómo hago un pedido?</p>
                    <p>Añade productos a tu carrito y luego procede al pago desde la página del carrito. Deberás completar tu información de contacto y envío. El administrador de {storeName} usará estos datos para realizar el pedido en tu nombre a través de plataformas como Temu, Amazon o AliExpress.</p>
                </div>
                 <div>
                    <p className="font-medium text-card-foreground">¿Cómo funciona el pago?</p>
                    <p>Actualmente, el proceso de pago final se gestiona a través de PayPal (simulado para la redirección). {storeName} recopila tus datos para que el administrador pueda completar la compra en el sitio del proveedor.</p>
                </div>
            </div>
        </section>
        
        <section>
            <h3 className="text-xl font-semibold text-foreground mb-2">Contactar Soporte</h3>
            <p>Para asistencia directa, puedes enviarnos un correo electrónico:</p>
            <div className="mt-3">
                <a href={`mailto:${contactEmail}`} className="inline-flex items-center text-primary hover:underline font-medium text-lg">
                <Mail className="w-5 h-5 mr-2" /> {contactEmail}
                </a>
            </div>
        </section>

        <section>
            <h3 className="text-xl font-semibold text-foreground mb-2">Otros Recursos</h3>
             <ul className="space-y-1 mt-2">
                <li><Link to="/terminos-y-condiciones" className="inline-flex items-center text-primary hover:underline"><ExternalLink size={14} className="mr-1.5"/>Términos y Condiciones</Link></li>
                <li><Link to="/politica-de-privacidad" className="inline-flex items-center text-primary hover:underline"><ExternalLink size={14} className="mr-1.5"/>Política de Privacidad</Link></li>
            </ul>
        </section>
      </div>
    </motion.div>
  );
};

export default SupportPage;