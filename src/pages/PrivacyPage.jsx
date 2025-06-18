import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const PrivacyPage = () => {
  const navigate = useNavigate();
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
        <Shield className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Política de Privacidad</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-4">
        <p>La protección de su privacidad es un pilar fundamental para {storeName}. Esta política detalla cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestros servicios.</p>
        
        <h2 className="text-xl font-semibold text-foreground pt-4">Información Recopilada</h2>
        <p>Recopilamos la información que usted nos proporciona directamente. Esto ocurre, por ejemplo, al crear una cuenta, suscribirse a comunicaciones, interactuar con funciones de nuestro sitio, completar formularios (como el de finalización de compra), solicitar asistencia o contactarnos.</p>
        <p>La información puede incluir su nombre, dirección de correo electrónico, dirección postal, número de teléfono, y datos necesarios para procesar su pedido a través de nuestros proveedores externos. {storeName} no almacena directamente los detalles de sus tarjetas de crédito o débito en nuestros servidores.</p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Finalidad del Tratamiento de Datos</h2>
        <p>La información recopilada se utiliza para los siguientes fines:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Proveer, mantener y optimizar nuestros servicios como plataforma de reventa digital.</li>
          <li>Gestionar y facilitar el proceso de sus pedidos con proveedores externos, lo cual implica compartir la información estrictamente necesaria con dichos proveedores para completar su compra.</li>
          <li>Enviar comunicaciones técnicas, actualizaciones, alertas de seguridad y mensajes administrativos o de soporte.</li>
          <li>Atender sus comentarios, preguntas y solicitudes, y proporcionar un servicio al cliente eficiente.</li>
          <li>Informarle sobre productos, servicios, ofertas, promociones y eventos de {storeName} u otros que consideremos de su interés.</li>
        </ul>
        <p>Para una comprensión más detallada de nuestras operaciones y la relación con terceros, le invitamos a consultar nuestro <Link to="/aviso-legal-terceros" className="text-primary hover:underline">Aviso Legal y Modelo de Negocio</Link>.</p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Divulgación de Información</h2>
        <p>Su información personal podrá ser compartida en las siguientes circunstancias, o según se describa en esta Política:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Con proveedores, consultores y otros prestadores de servicios que requieran acceso a dicha información para realizar trabajos en nuestro nombre, incluyendo el procesamiento de pedidos con plataformas externas.</li>
            <li>En respuesta a solicitudes de información si consideramos que la divulgación es conforme a la ley, regulación o proceso legal aplicable.</li>
            <li>Si consideramos que sus acciones infringen nuestros acuerdos de usuario o políticas, o para proteger los derechos, propiedad y seguridad de {storeName} o terceros.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Seguridad de la Información</h2>
        <p>Implementamos medidas de seguridad razonables para proteger su información contra pérdida, robo, uso indebido, acceso no autorizado, divulgación, alteración y destrucción. La información de pago sensible no se procesa ni almacena directamente en nuestros sistemas; es gestionada por personal autorizado para completar pedidos en las plataformas de los proveedores o a través de pasarelas de pago seguras, si se utilizan.</p>
        
        <p className="mt-6 text-center text-sm">
          Si tiene preguntas sobre esta política, por favor <Link to="/soporte" className="text-primary hover:underline">contáctenos</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;