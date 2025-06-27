import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const TermsPage = () => {
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
        <FileText className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Términos y Condiciones Generales</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-4">
        <p>Le damos la bienvenida a {storeName}. El uso de este sitio web está sujeto a los siguientes términos y condiciones.</p>
        <p>Al acceder y utilizar los servicios de {storeName}, usted acepta y se compromete a cumplir con la totalidad de los términos aquí expuestos. Si no está de acuerdo con alguno de estos términos, le solicitamos que no utilice nuestro sitio web.</p>
        
        <h2 className="text-xl font-semibold text-foreground pt-4">Modelo de Negocio y Procedencia de Productos</h2>
        <p>{storeName} funciona como una plataforma de reventa digital. Los productos listados en este sitio no son fabricados ni despachados directamente por nuestra empresa. Provienen de una red de proveedores y tiendas externas. {storeName} actúa como un intermediario, facilitando la adquisición y gestión de estos productos bajo un marco legal y transparente.</p>
        <p>Nuestro modelo no corresponde al dropshipping tradicional. Adquirimos productos de diversas plataformas para luego revenderlos en {storeName}, aplicando nuestros propios precios. Este proceso puede generar márgenes comerciales derivados de la gestión, adquisición y el servicio al cliente que proporcionamos.</p>
        <p>Para una descripción detallada de nuestro modelo operativo y la relación con proveedores, le remitimos a nuestro <Link to="/aviso-legal-terceros" className="text-primary hover:underline">Aviso Legal y Modelo de Negocio</Link>.</p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Propiedad Intelectual y Licencia de Uso</h2>
        <p>Salvo indicación contraria, {storeName} y/o sus licenciantes son titulares de los derechos de propiedad intelectual sobre todo el material publicado en {storeName}. Todos los derechos están reservados. Usted puede visualizar y/o imprimir contenido del sitio web de {storeName} para uso personal, sujeto a las restricciones aquí detalladas.</p>
        <p>Queda estrictamente prohibido:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Republicar material proveniente del sitio web de {storeName}.</li>
          <li>Comercializar, alquilar o sublicenciar material del sitio web de {storeName}.</li>
          <li>Reproducir, duplicar o copiar material del sitio web de {storeName}.</li>
          <li>Redistribuir contenido de {storeName} (a menos que dicho contenido esté explícitamente destinado para la redistribución).</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Limitación de Responsabilidad sobre Productos</h2>
        <p>{storeName}, en su rol de intermediario, no asume responsabilidad directa por defectos de fabricación o por las garantías de los productos, ya que estas son competencia del proveedor original. No obstante, gestionamos cada pedido con diligencia y le asistiremos en la comunicación con el proveedor ante cualquier incidencia. Nuestra responsabilidad se circunscribe a la gestión de la compra y al soporte al cliente en nombre del comprador.</p>
        
        <h2 className="text-xl font-semibold text-foreground pt-4">Exención General de Responsabilidad</h2>
        <p>La información provista por {storeName} en este sitio se ofrece únicamente con fines informativos generales. Si bien nos esforzamos por mantener la información precisa y actualizada, no ofrecemos garantías de ningún tipo, expresas o implícitas, sobre la exactitud, adecuación, validez, fiabilidad, disponibilidad o integridad de la información contenida en el sitio.</p>
        
        <p className="mt-6 text-center text-sm">
          Para consultas sobre estos términos, por favor <Link to="/soporte" className="text-primary hover:underline">contáctenos</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default TermsPage;