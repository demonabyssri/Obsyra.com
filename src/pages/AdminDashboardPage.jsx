import React from 'react';
import { motion } from 'framer-motion';
import { List, Edit, Trash2, PlusCircle, DollarSign, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminDashboardPage = ({ products, setProducts, setIsAddProductModalOpen }) => {

  const totalRevenue = products.reduce((sum, p) => {
    const sold = (p.initialStock || 0) - (p.stock || 0);
    return sum + (p.sellingPrice * sold);
  }, 0);
  
  const totalProfit = products.reduce((sum, p) => {
    const sold = (p.initialStock || 0) - (p.stock || 0);
    return sum + ((p.sellingPrice - p.originalPrice) * sold);
  }, 0);
  const totalProducts = products.length;

  const handleDeleteProduct = (productId) => {
    toast({
      title: "¿Seguro que quieres eliminar este producto?",
      description: "Esta acción no se puede deshacer.",
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administrador</h1>
        <p className="text-gray-600">Gestiona tus productos, ventas y configuraciones de la tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<DollarSign className="text-green-500"/>} title="Ingresos Totales (Simulado)" value={`$${totalRevenue.toFixed(2)}`} bgColor="bg-green-50"/>
        <StatCard icon={<BarChart2 className="text-blue-500"/>} title="Ganancia Total (Simulada)" value={`$${totalProfit.toFixed(2)}`} bgColor="bg-blue-50"/>
        <StatCard icon={<List className="text-purple-500"/>} title="Productos Totales" value={totalProducts} bgColor="bg-purple-50"/>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl glass-effect border-purple-200/50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 sm:mb-0">Mis Productos</h2>
          <Button onClick={() => setIsAddProductModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nuevo Producto
          </Button>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tienes productos añadidos todavía. ¡Empieza añadiendo algunos!</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venta</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganancia</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs" title={product.name}>{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${product.originalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">${product.sellingPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-semibold">${(product.sellingPrice - product.originalPrice).toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 border-blue-500 text-blue-500 hover:bg-blue-50" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id)}>
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
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${bgColor} glass-effect border-purple-200/30`}>
        <div className="p-3 rounded-full bg-white shadow-md">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


export default AdminDashboardPage;