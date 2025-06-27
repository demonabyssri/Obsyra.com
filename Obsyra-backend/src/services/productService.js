// Obsyra-backend/src/services/productService.js
const productModel = require('../models/product');
const { db } = require('../config/firebase');

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        next({ statusCode: 500, message: 'Error al obtener productos.' });
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productModel.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        next({ statusCode: 500, message: 'Error al obtener producto.' });
    }
};

const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        productData.price = parseFloat(productData.price);
        productData.sellingPrice = parseFloat(productData.sellingPrice);
        productData.stock = parseInt(productData.stock, 10);

        const newProduct = await productModel.createProduct(productData);
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        next({ statusCode: 500, message: 'Error al crear producto.' });
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.sellingPrice) updateData.sellingPrice = parseFloat(updateData.sellingPrice);
        if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);
        
        const updatedProduct = await productModel.updateProduct(id, updateData);
        res.status(200).json({ message: 'Producto actualizado exitosamente', product: { id, ...updateData } });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        next({ statusCode: 500, message: 'Error al actualizar producto.' });
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productModel.deleteProduct(id);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        next({ statusCode: 500, message: 'Error al eliminar producto.' });
    }
};

const updateProductStock = async (productId, quantityChange, type = 'decrease') => {
    const productRef = db.collection('products').doc(productId);

    try {
        const updated = await db.runTransaction(async (transaction) => {
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists) {
                throw new Error('Producto no encontrado para actualización de stock.');
            }

            const currentStock = productDoc.data().stock;
            let newStock;

            if (type === 'decrease') {
                newStock = currentStock - quantityChange;
                if (newStock < 0) {
                    throw new Error(`Stock insuficiente para el producto ${productDoc.data().name}.`);
                }
            } else if (type === 'increase') {
                newStock = currentStock + quantityChange;
            } else {
                throw new Error('Tipo de cambio de stock inválido.');
            }

            transaction.update(productRef, { stock: newStock, updatedAt: db.FieldValue.serverTimestamp() });
            return newStock;
        });
        console.log(`Stock de producto ${productId} actualizado a ${updated}`);
        return updated;
    } catch (error) {
        console.error(`Error de transacción al actualizar stock para ${productId}:`, error.message);
        throw error;
    }
};

const handleUpdateProductStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantityChange, type } = req.body; 

        if (!quantityChange || typeof quantityChange !== 'number' || quantityChange <= 0) {
            return res.status(400).json({ message: 'Cantidad de cambio de stock inválida.' });
        }
        if (type !== 'increase' && type !== 'decrease') {
            return res.status(400).json({ message: 'Tipo de cambio de stock inválido.' });
        }

        const newStock = await updateProductStock(id, quantityChange, type);
        res.status(200).json({ message: 'Stock actualizado exitosamente', newStock });
    } catch (error) {
        console.error('Error en handleUpdateProductStock:', error);
        next({ statusCode: 400, message: error.message || 'Error al actualizar stock del producto.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock, 
    handleUpdateProductStock 
};