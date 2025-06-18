import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, Edit, Trash2, PlusCircle, DollarSign, BarChart2, Users, Settings, ShoppingBag, Bell, Shield, Power, UserPlus, Minus, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, ComposedChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input'; 

const AdminPage = ({ products, setProducts, setIsAddProductModalOpen, categories, adminEmail, updateProductStock: globalUpdateProductStock }) => {
  const [activeProducts, setActiveProducts] = useState([]);

  useEffect(() => {
    setActiveProducts(products.map(p => ({ ...p, active: true, editStock: p.stock })));
  }, [products]);


  const totalActiveProducts = activeProducts.filter(p => p.active).length;

  const handleDeleteProduct = (productId) => {
    toast({
      title: "¿Seguro que quieres eliminar este producto?",
      description: "Esta acción no se puede deshacer.",
      variant: "destructive",
      action: (
        <Button variant="destructive" size="sm" onClick={() => {
          const updatedActiveProducts = activeProducts.filter(p => p.id !== productId);
          setActiveProducts(updatedActiveProducts);
          
          const updatedGlobalProducts = products.filter(p => p.id !== productId);
          setProducts(updatedGlobalProducts);
          localStorage.setItem('userProducts', JSON.stringify(updatedGlobalProducts));
          toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado de tu tienda." });
        }}>
          Sí, eliminar
        </Button>
      ),
    });
  };

  const handleToggleProductStatus = (productId) => {
    setActiveProducts(prev => 
      prev.map(p => p.id === productId ? {...p, active: !p.active } : p)
    );
    const product = activeProducts.find(p => p.id === productId);
    toast({
      title: `Producto ${product && !product.active ? "Activado" : "Desactivado"}`,
      description: `${product ? product.name : ''} ahora está ${product && !product.active ? "visible" : "oculto"} en la tienda.`,
    });
  };

  const handleStockChange = (productId, newStock) => {
    const stock = parseInt(newStock, 10);
    if (isNaN(stock) || stock < 0) {
        toast({title: "Stock Inválido", description: "El stock debe ser un número positivo.", variant: "destructive"});
        setActiveProducts(prev => prev.map(p => p.id === productId ? { ...p, editStock: p.stock } : p)); 
        return;
    }
    setActiveProducts(prev => prev.map(p => p.id === productId ? { ...p, editStock: stock } : p));
  };

  const handleSaveStock = (productId) => {
    const productToUpdate = activeProducts.find(p => p.id === productId);
    if (!productToUpdate) return;

    globalUpdateProductStock(productId, productToUpdate.stock - productToUpdate.editStock, true); 

    setActiveProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.editStock } : p));
    
    setProducts(prevGlobal => prevGlobal.map(p => p.id === productId ? {...p, stock: productToUpdate.editStock} : p));
    localStorage.setItem('userProducts', JSON.stringify(products.map(p => p.id === productId ? {...p, stock: productToUpdate.editStock} : p)));
    
    toast({
      title: "Stock Actualizado",
      description: `Stock de ${productToUpdate.name} actualizado a ${productToUpdate.editStock}.`,
    });
  };


  const handleEditProduct = (product) => {
     toast({
      title: "Edición no disponible",
      description: "La edición de productos directamente desde aquí no está implementada. Puedes eliminar y volver a añadir el producto.",
      variant: "default"
    });
  };

  const handleNotImplementedYet = (featureName) => {
     toast({
      title: "Función no disponible",
      description: `La sección "${featureName}" requiere integración con un servicio externo o un backend y no está implementada.`,
      variant: "default",
      duration: 5000,
    });
  };

  const salesData = [
    { name: 'Ene', Ventas: 0, Ganancia: 0 },
    { name: 'Feb', Ventas: 0, Ganancia: 0 },
    { name: 'Mar', Ventas: 0, Ganancia: 0 },
    { name: 'Abr', Ventas: 0, Ganancia: 0 },
    { name: 'May', Ventas: 0, Ganancia: 0 },
  ];
  
  const hasRealSalesData = false; 

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
        <StatCard icon={<ShoppingBag className="text-primary"/>} title="Productos Activos" value={totalActiveProducts} />
        <StatCard icon={<Users className="text-yellow-400"/>} title="Clientes Totales" value="N/A" tooltip="Requiere backend para datos reales"/>
      </div>

      <div className="mb-10 bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
        <h2 className="text-2xl font-semibold text-card-foreground mb-4">Rendimiento de Ventas</h2>
        {!hasRealSalesData && (
          <div className="flex items-center p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700" role="alert">
            <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">Datos de ejemplo.</span> Los gráficos mostrarán datos reales cuando se integre un backend de seguimiento de ventas.
          </div>
        )}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                cursor={{ fill: 'hsla(var(--accent), 0.1)' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Bar yAxisId="left" dataKey="Ventas" fill="hsla(var(--primary), 0.7)" barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="Ganancia" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--accent))' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4 sm:mb-0">Gestión de Productos</h2>
            <Button onClick={() => setIsAddProductModalOpen(true)} className="btn-gradient-primary text-primary-foreground shadow-md hover:shadow-primary/30">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nuevo Producto
            </Button>
            </div>

            {activeProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tienes productos añadidos todavía. ¡Empieza añadiendo algunos!</p>
            ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                    <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Venta</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {activeProducts.map((product) => (
                    <tr key={product.id} className={`hover:bg-secondary/30 transition-colors ${!product.active ? 'opacity-60' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-card-foreground truncate max-w-[150px] sm:max-w-xs" title={product.name}>{product.name}</div>
                        <div className="text-xs text-muted-foreground">{categories.find(c=>c.id === product.category)?.name || product.category}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {product.active ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">${product.originalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-card-foreground font-semibold">${product.sellingPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1 w-28">
                                <Input 
                                  type="number" 
                                  value={product.editStock} 
                                  onChange={(e) => handleStockChange(product.id, e.target.value)}
                                  className="w-16 h-8 p-1 text-sm bg-input border-input-border"
                                />
                                {product.editStock !== product.stock && (
                                    <Button size="xs" variant="ghost" onClick={() => handleSaveStock(product.id)} className="h-7 w-7 p-0 text-primary">✔️</Button>
                                )}
                            </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-blue-500/70 text-blue-500 hover:bg-accent hover:text-accent-foreground" onClick={() => handleToggleProductStatus(product.id)} title={product.active ? "Desactivar producto" : "Activar producto"}>
                            <Power className="h-4 w-4" />
                        </Button>
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
            <AdminActionCard title="Ver Pedidos" icon={<List className="text-primary"/>} description="Revisa y gestiona los pedidos de los clientes." onClick={() => handleNotImplementedYet("Gestión de Pedidos")} />
            <AdminActionCard title="Gestión de Usuarios" icon={<Users className="text-yellow-400"/>} description="Ver lista de usuarios y sus roles." onClick={() => handleNotImplementedYet("Gestión de Usuarios")} />
            <AdminActionCard title="Permisos de Admin" icon={<Shield className="text-red-400"/>} description="Asignar permisos temporales a otros administradores." onClick={() => handleNotImplementedYet("Asignar Permisos Admin")} />
            <AdminActionCard title="Configuración de la Tienda" icon={<Settings className="text-teal-400"/>} description="Ajusta detalles de la tienda, envíos y pagos." onClick={() => handleNotImplementedYet("Configuración de Tienda")} />
             <AdminActionCard title="Notificaciones y Alertas" icon={<Bell className="text-indigo-400"/>} description="Configurar alertas de stock bajo o nuevos pedidos." onClick={() => handleNotImplementedYet("Notificaciones y Alertas")} />
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
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-background text-foreground text-xs rounded-md shadow-lg border border-border whitespace-nowrap z-50">
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
        {children && <div className="mt-3">{children}</div>}
        {!children && <Button variant="link" onClick={onClick} className="p-0 text-xs text-primary hover:text-primary/80">Ir a sección &rarr;</Button>}
    </motion.div>
);


export default AdminPage;