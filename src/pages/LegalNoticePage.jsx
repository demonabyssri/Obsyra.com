import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, ChevronLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const LegalNoticePage = () => {
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
        <Gavel className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Aviso Legal y Modelo de Negocio</h1>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border text-muted-foreground space-y-6">
        
        <div className="p-4 bg-secondary/50 border border-primary/30 rounded-lg flex items-start space-x-3">
            <ShieldAlert size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Naturaleza de Nuestros Servicios</h2>
                <p className="text-sm">
                    {storeName} es una plataforma que facilita la adquisición de productos actuando como intermediario. <strong>No fabricamos ni poseemos inventario físico de los artículos ofrecidos.</strong> Los productos listados provienen de una red de proveedores y distribuidores externos.
                </p>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Modelo de Operación: Reventa Digital</h3>
            <p>Nuestra operación se basa en un modelo de <strong>reventa digital</strong>. Esto implica:</p>
            <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                <li>Una cuidadosa selección y presentación de productos de diversos proveedores.</li>
                <li>Cuando usted realiza un pedido, {storeName} gestiona la adquisición del producto del proveedor original en su nombre.</li>
                <li>Proveemos la interfaz de compra, el procesamiento del pedido y el servicio de atención al cliente.</li>
                <li>Los precios en {storeName} reflejan el costo del producto base, así como nuestros servicios de gestión, adquisición, curación y soporte al cliente.</li>
            </ul>
            <p className="mt-2">Este enfoque nos permite ofrecer una diversa gama de productos sin las cargas logísticas del almacenamiento físico tradicional.</p>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Responsabilidad y Garantías de Producto</h3>
            <p>
                {storeName} actúa como facilitador en la compra de productos. Como tal, <strong>la responsabilidad por demoras en el envío, defectos de fabricación, o la aplicabilidad de garantías recae primordialmente en los fabricantes o proveedores originales.</strong>
            </p>
            <p>
                Nos comprometemos a asistirle en cualquier comunicación necesaria con el proveedor si surgiera algún inconveniente con su producto. Su satisfacción es nuestra prioridad, y le ofreceremos soporte durante el proceso postventa dentro del alcance de nuestras funciones como intermediarios.
            </p>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Uso de Contenido y Propiedad Intelectual</h3>
            <p>
                El material gráfico, descripciones de productos y cualquier otro contenido presentado en {storeName} son propiedad de sus respectivos titulares (fabricantes, proveedores) y se utilizan en nuestro sitio con fines informativos y comerciales, en conformidad con las normativas y políticas de dichas entidades.
            </p>
            <p>
                Si usted es titular de algún contenido y considera que su uso en nuestra plataforma no es apropiado, le rogamos <Link to="/soporte" className="text-primary hover:underline">contactarnos</Link> para su revisión.
            </p>
        </div>
        
        <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Consentimiento Informado</h3>
            <p>
                Al realizar una transacción en {storeName}, usted reconoce haber leído, comprendido y aceptado los términos expuestos en este Aviso Legal, así como en nuestros <Link to="/terminos-y-condiciones" className="text-primary hover:underline">Términos y Condiciones Generales</Link> y nuestra <Link to="/politica-de-privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.
            </p>
        </div>

        <p className="mt-8 text-center text-sm">
          Para cualquier consulta referente a este aviso o nuestro modelo operativo, no dude en <Link to="/soporte" className="text-primary hover:underline">contactarnos</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default LegalNoticePage;