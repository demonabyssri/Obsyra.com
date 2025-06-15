import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();
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
        <Shield className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Política de Privacidad</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-4">
        <p>Tu privacidad es importante para nosotros. Es política de Phantom Deals respetar tu privacidad con respecto a cualquier información que podamos recopilar mientras operamos nuestro sitio web.</p>
        
        <h2 className="text-xl font-semibold text-foreground pt-4">Información que Recopilamos</h2>
        <p>Recopilamos información que nos proporcionas directamente. Por ejemplo, recopilamos información cuando creas una cuenta, te suscribes, participas en cualquier función interactiva de nuestros servicios, completas un formulario, solicitas atención al cliente o te comunicas con nosotros de otra manera.</p>
        <p>Los tipos de información que podemos recopilar incluyen tu nombre, dirección de correo electrónico, dirección postal, número de teléfono e información de pago (simulada).</p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Uso de la Información</h2>
        <p>Podemos usar la información sobre ti para varios propósitos, incluyendo:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Proveer, mantener y mejorar nuestros servicios;</li>
          <li>Procesar transacciones (simuladas) y enviarte información relacionada, incluyendo confirmaciones y facturas (simuladas);</li>
          <li>Enviar avisos técnicos, actualizaciones, alertas de seguridad y mensajes de soporte y administrativos;</li>
          <li>Responder a tus comentarios, preguntas y solicitudes y proporcionar servicio al cliente;</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Seguridad de los Datos</h2>
        <p>Tomamos medidas razonables para ayudar a proteger la información sobre ti de pérdida, robo, mal uso y acceso no autorizado, divulgación, alteración y destrucción.</p>
        <p>Este sitio es una demostración. No se almacena información de pago real ni sensible de forma persistente ni se utiliza para transacciones reales.</p>
        
        <p className="mt-6 text-center text-sm">
          Para cualquier pregunta sobre esta política, por favor <Link to="/soporte" className="text-primary hover:underline">contáctanos</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;