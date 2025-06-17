
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Zap, Edit3, ShieldCheck } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const StatsSection = () => {
  const { storeName } = useStoreSettings();
  const features = [
    { icon: Globe, title: "Vende Globalmente", desc: "Llega a clientes de todo el mundo con tus productos." },
    { icon: Edit3, title: "Control Total de Precios", desc: "Define tus propios márgenes de ganancia para cada artículo." },
    { icon: TrendingUp, title: "Maximiza Ganancias", desc: "Compra barato, vende inteligentemente. Tú decides el precio final." },
    { icon: Zap, title: "Gestión Simplificada", desc: "Procesa pedidos y gestiona tu inventario de forma sencilla." },
    { icon: ShieldCheck, title: "Privacidad Asegurada", desc: "Tu información y la de tus clientes, protegidas." },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary via-accent to-secondary">
      <div className="container mx-auto text-center text-primary-foreground">
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          ¿Por qué {storeName} es para Ti?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="floating-animation"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="glass-effect rounded-2xl p-8 h-full flex flex-col items-center bg-background/10 backdrop-blur-md border border-white/20">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
