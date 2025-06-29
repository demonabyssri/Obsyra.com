import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, DollarSign, Link as LinkIcon, Tag, ShoppingBag, Globe as GlobeIcon, Info, Image as ImageIcon, CheckCircle, Edit3, Zap, TrendingDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AddProductModal = ({ isOpen, onClose, onAddProduct, categories }) => {
  const [supplierUrl, setSupplierUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState(''); 
  const [sellingPrice, setSellingPrice] = useState(''); 
  const [discountedPrice, setDiscountedPrice] = useState(''); 
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [stock, setStock] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);


  const handleFetchProductData = async () => {
    if (!supplierUrl) {
        toast({ title: "URL Requerida", description: "Por favor, ingresa la URL del producto del proveedor.", variant: "destructive" });
        return;
    }
    setIsFetchingData(true);
    
    toast({
      title: "Extracción de Datos",
      description: "La extracción automática de datos de URL de proveedores requiere un backend y no está implementada en esta versión.",
      variant: "default",
      duration: 7000,
    });
    
    setProductName('');
    setProductDescription('');
    setOriginalPrice(''); 
    setSellingPrice(''); 
    setImageDescription('');
    
    setIsFetchingData(false);
    setDataFetched(true); 
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !originalPrice || !sellingPrice || !category || !stock ) {
        toast({ title: "Campos Obligatorios", description: "Por favor, completa: Nombre, Tu Costo, Precio Venta, Categoría y Stock.", variant: "destructive"});
        return;
    }
    
    onAddProduct({
      name: productName,
      description: productDescription,
      originalPrice: parseFloat(originalPrice), 
      sellingPrice: parseFloat(sellingPrice), 
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null, 
      supplierUrl, 
      category,
      stock: parseInt(stock),
      imageDescription, 
      rating: (Math.random() * 2 + 3).toFixed(1), 
      reviews: Math.floor(Math.random() * 200), 
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSupplierUrl('');
    setProductName('');
    setProductDescription('');
    setOriginalPrice('');
    setSellingPrice('');
    setDiscountedPrice('');
    setCategory(categories[0]?.id || '');
    setStock('');
    setImageDescription('');
    setDataFetched(false);
    setIsFetchingData(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => { resetForm(); onClose();}}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-card text-card-foreground rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { resetForm(); onClose();}}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary"
            >
              <X size={24} />
            </button>
            <div className="flex items-center justify-center mb-6">
                <LinkIcon className="w-8 h-8 mr-3 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                Añadir Producto desde URL
                </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="supplierUrl" className="block text-sm font-medium text-muted-foreground mb-1">URL del Producto (Proveedor)*</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    id="supplierUrl"
                    value={supplierUrl}
                    onChange={(e) => setSupplierUrl(e.target.value)}
                    placeholder="Pega la URL del producto aquí (ej: Temu, Amazon)"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-input"
                    required
                  />
                  <Button type="button" onClick={handleFetchProductData} disabled={isFetchingData || !supplierUrl} className="btn-gradient-primary text-primary-foreground h-11 whitespace-nowrap">
                    {isFetchingData ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div> : <Zap size={18}/>}
                    <span className="ml-2 hidden sm:inline">{isFetchingData ? "Obteniendo..." : "Obtener Datos"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Intentará obtener datos. La extracción completa requiere un backend.</p>
              </div>

              {(dataFetched || supplierUrl) && ( 
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6 mt-6 border-t border-border pt-6"
                >
                    <div className="relative">
                        <label htmlFor="productName" className="block text-sm font-medium text-muted-foreground mb-1">Nombre del Producto*</label>
                         <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground mx-3" />
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Nombre que se mostrará en tu tienda"
                            className="w-full p-3 border-0 focus:ring-0 rounded-lg bg-transparent"
                            required
                        />
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="productDescription" className="block text-sm font-medium text-muted-foreground mb-1">Descripción (Breve)</label>
                        <div className="flex items-start border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                        <Info className="w-5 h-5 text-muted-foreground mx-3 mt-3.5 flex-shrink-0" />
                        <textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows="3"
                            placeholder="Detalles del producto, materiales, etc."
                            className="w-full p-3 border-0 focus:ring-0 rounded-lg resize-none bg-transparent"
                        ></textarea>
                        </div>
                    </div>
              
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-muted-foreground mb-1">Tu Costo (Proveedor)*</label>
                        <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                            <DollarSign className="w-5 h-5 text-muted-foreground mx-3" />
                            <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} step="0.01" placeholder="Costo de adquisición" className="w-full p-3 border-0 focus:ring-0 rounded-lg bg-transparent" required />
                        </div>
                        </div>

                        <div className="relative">
                        <label htmlFor="sellingPrice" className="block text-sm font-medium text-muted-foreground mb-1">Precio de Venta (Cliente)*</label>
                        <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                            <DollarSign className="w-5 h-5 text-primary mx-3" />
                            <input type="number" id="sellingPrice" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} step="0.01" placeholder="Precio final para el cliente" className="w-full p-3 border-0 focus:ring-0 rounded-lg bg-transparent" required />
                        </div>
                        </div>
                    </div>

                     <div className="relative">
                        <label htmlFor="discountedPrice" className="block text-sm font-medium text-muted-foreground mb-1">Precio Original (Antes del Descuento - Opcional)</label>
                        <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                            <TrendingDown className="w-5 h-5 text-muted-foreground mx-3" />
                            <input type="number" id="discountedPrice" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} step="0.01" placeholder="Ej: 200 (si está en oferta)" className="w-full p-3 border-0 focus:ring-0 rounded-lg bg-transparent" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Si se establece, el "Precio de Venta" actuará como el precio de oferta.</p>
                    </div>
              
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Categoría*</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-input" required >
                            {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                        </div>
                        <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-muted-foreground mb-1">Stock Disponible*</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} min="0" placeholder="Cantidad disponible" className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-input" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageDescription" className="block text-sm font-medium text-muted-foreground mb-1">Palabras Clave para Imagen (Opcional)</label>
                        <div className="flex items-center border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-input">
                        <ImageIcon className="w-5 h-5 text-muted-foreground mx-3" />
                        <input type="text" id="imageDescription" value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} placeholder="Ej: Camiseta negra, logo Z" className="w-full p-3 border-0 focus:ring-0 rounded-lg bg-transparent" />
                        </div>
                         <p className="text-xs text-muted-foreground mt-1">Se usará para generar una imagen de marcador de posición. La subida de imágenes real no está disponible.</p>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => { resetForm(); onClose();}} className="text-muted-foreground border-border hover:bg-secondary"> Cancelar </Button>
                        <Button type="button" onClick={handleSubmit} className="btn-gradient-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg flex items-center space-x-2">
                        <CheckCircle size={20} />
                        <span>Añadir Producto</span>
                        </Button>
                    </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;