import React from 'react';
import { motion } from 'framer-motion';
import { List, Edit, Trash2, PlusCircle, DollarSign, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminDashboardPage = ({ products, setProducts, setIsAddProductModalOpen }) => {

  const totalRevenue = 0; 
  const totalProfit = 0; 
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
     toast({
      title: "Edición no disponible",
      description: "La edición de productos directamente desde aquí no está implementada. Puedes eliminar y volver a añadir el producto.",
      variant: "default"
    });
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
        <p className="text-muted-foreground">Gestiona tus productos, ventas y configuraciones de la tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<DollarSign className="text-green-400"/>} title="Ingresos Totales" value={"N/A"} tooltip="Requiere backend para datos reales"/>
        <StatCard icon={<BarChart2 className="text-blue-400"/>} title="Ganancia Total" value={"N/A"} tooltip="Requiere backend para datos reales"/>
        <StatCard icon={<List className="text-primary"/>} title="Productos Totales" value={totalProducts} />
      </div>
      
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-2xl border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4 sm:mb-0">Mis Productos</h2>
          <Button onClick={() => setIsAddProductModalOpen(true)} className="btn-gradient-primary text-primary-foreground">
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ganancia Potencial</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-card-foreground truncate max-w-[150px] sm:max-w-xs" title={product.name}>{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">${product.originalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-card-foreground font-semibold">${product.sellingPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-500 font-semibold">${(product.sellingPrice - product.originalPrice).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{product.stock}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 border-blue-500/70 text-blue-500 hover:bg-accent hover:text-accent-foreground" onClick={() => handleEditProduct(product)}>
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
       <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm flex items-start">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
            <span>Las métricas de Ingresos y Ganancias requieren un sistema de seguimiento de pedidos real (backend) para ser precisas. Los valores mostrados son ilustrativos o N/A.</span>
        </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, bgColor, tooltip }) => (
    <div className={`bg-card p-5 rounded-xl shadow-lg flex items-center space-x-4 border border-border relative group ${bgColor || ''}`}>
        <div className="p-3 rounded-full bg-secondary/50 shadow-md">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {tooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-background text-foreground text-xs rounded-md shadow-lg border border-border whitespace-nowrap z-50">
                {tooltip}
            </div>
        )}
    </div>
);


export default AdminDashboardPage;