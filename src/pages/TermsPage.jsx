
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
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Términos y Condiciones</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-4">
        <p>Bienvenido a {storeName}. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de {storeName}.</p>
        <p>Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes usando el sitio web de {storeName} si no aceptas todos los términos y condiciones establecidos en esta página.</p>
        
        <h2 className="text-xl font-semibold text-foreground pt-4">Licencia</h2>
        <p>A menos que se indique lo contrario, {storeName} y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en {storeName}. Todos los derechos de propiedad intelectual son reservados. Puedes ver y/o imprimir páginas desde {storeName.toLowerCase()}.com (o el dominio aplicable) para tu propio uso personal sujeto a las restricciones establecidas en estos términos y condiciones.</p>
        <p>No debes:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Republicar material de {storeName.toLowerCase()}.com</li>
          <li>Vender, alquilar o sublicenciar material de {storeName.toLowerCase()}.com</li>
          <li>Reproducir, duplicar o copiar material de {storeName.toLowerCase()}.com</li>
          <li>Redistribuir contenido de {storeName} (a menos que el contenido se haga específicamente para la redistribución).</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">Descargo de Responsabilidad</h2>
        <p>La información proporcionada por {storeName} ("nosotros", "nos" o "nuestro") en {storeName.toLowerCase()}.com (el "Sitio") es solo para fines informativos generales y de demostración. Aunque nos esforzamos por mantener la información actualizada y correcta, no hacemos ninguna representación o garantía de ningún tipo, expresa o implícita, con respecto a la exactitud, adecuación, validez, fiabilidad, disponibilidad o integridad de cualquier información en el Sitio.</p>
        <p>{storeName} es una plataforma donde los administradores pueden listar productos de diversos proveedores. El proceso de compra final, pago y envío es gestionado por el administrador de la tienda utilizando las plataformas de los proveedores (ej. Temu, Amazon, AliExpress) y pasarelas de pago externas. Los datos de pago y envío ingresados por el cliente en {storeName} se utilizan para facilitar este proceso manual o semi-automatizado por el administrador.</p>
        <p className="mt-6 text-center text-sm">
          <Link to="/soporte" className="text-primary hover:underline">Contacta con nosotros</Link> si tienes alguna pregunta sobre estos términos.
        </p>
      </div>
    </motion.div>
  );
};

export default TermsPage;
