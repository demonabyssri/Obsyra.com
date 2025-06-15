
import React from 'react';
import { motion } from 'framer-motion';
import { List, Edit, Trash2, PlusCircle, DollarSign, BarChart2, Users, Settings, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminPage = ({ products, setProducts, setIsAddProductModalOpen, categories, adminEmail }) => {

  const totalProducts = products.length;

  const handleDeleteProduct = (productId) => {
    toast({
      title: "¿Seguro que quieres eliminar este producto?",
      description: "Esta acción no se puede deshacer.",
      variant: "destructive",
      action: (
        <Button variant="destructive" size="sm" onClick={() => {
          const updatedProducts = products.filter(p => p.id !== productId);
          setProducts(updatedProducts);
          localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
          toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado de tu tienda." });
        }}>
          Sí, eliminar
        </Button>
      ),
    });
  };

  const handleEditProduct = (product) => {
    toast({ title: "🚧 ¡Función de edición en desarrollo!", description: "Pronto podrás editar productos directamente aquí. Por ahora, puedes eliminarlo y volver a añadirlo con los cambios." });
  };

  const handleNotImplemented = (feature) => {
    toast({ title: "🚧 ¡Próximamente!", description: `La sección "${feature}" está en desarrollo y requiere un backend.` });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Panel de Administrador</h1>
        <p className="text-muted-foreground">Gestiona tu tienda <span className="font-semibold text-primary">{adminEmail}</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<DollarSign className="text-green-400"/>} title="Ingresos Totales" value="N/A" tooltip="Requiere backend para datos reales"/>
        <StatCard icon={<BarChart2 className="text-blue-400"/>} title="Ganancia Total" value="N/A" tooltip="Requiere backend para datos reales"/>
        <StatCard icon={<ShoppingBag className="text-primary"/>} title="Productos Activos" value={totalProducts} />
        <StatCard icon={<Users className="text-yellow-400"/>} title="Clientes Totales" value="N/A" tooltip="Requiere backend para datos reales"/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4 sm:mb-0">Gestión de Productos</h2>
            <Button onClick={() => setIsAddProductModalOpen(true)} className="btn-gradient-primary text-primary-foreground shadow-md hover:shadow-primary/30">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nuevo Producto
            </Button>
            </div>

            {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tienes productos añadidos todavía. ¡Empieza añadiendo algunos!</p>
            ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                    <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Venta</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ganancia</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {products.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-card-foreground truncate max-w-[150px] sm:max-w-xs" title={product.name}>{product.name}</div>
                        <div className="text-xs text-muted-foreground">{categories.find(c=>c.id === product.category)?.name || product.category}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">${product.originalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-card-foreground font-semibold">${product.sellingPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-semibold">${(product.sellingPrice - product.originalPrice).toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{product.stock}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-primary/70 text-primary hover:bg-accent hover:text-accent-foreground" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-destructive/70 text-destructive hover:bg-destructive/20 hover:text-destructive-foreground" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        <div className="lg:col-span-1 space-y-6">
            <AdminActionCard title="Ver Pedidos" icon={<List className="text-primary"/>} description="Revisa y gestiona los pedidos de los clientes." onClick={() => handleNotImplemented("Gestión de Pedidos")} />
            <AdminActionCard title="Configuración de la Tienda" icon={<Settings className="text-teal-400"/>} description="Ajusta detalles de la tienda, envíos y pagos." onClick={() => handleNotImplemented("Configuración de Tienda")} />
            
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, tooltip }) => (
    <div className={`bg-card p-5 rounded-xl shadow-lg flex items-center space-x-4 border border-border relative group`}>
        <div className="p-3 rounded-full bg-secondary/50 shadow-md">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {tooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-700 text-white text-xs rounded-md whitespace-nowrap">
                {tooltip}
            </div>
        )}
    </div>
);

const AdminActionCard = ({ icon, title, description, onClick, children }) => (
    <motion.div 
        whileHover={{ y: -3, boxShadow: "0 8px 15px hsla(var(--primary), 0.15)"}}
        className="bg-card p-6 rounded-xl shadow-lg border border-border"
    >
        <div className="flex items-center mb-3 cursor-pointer" onClick={!children ? onClick : undefined}>
            {icon}
            <h3 className="ml-3 text-lg font-semibold text-card-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        {children}
    </motion.div>
);


export default AdminPage;
