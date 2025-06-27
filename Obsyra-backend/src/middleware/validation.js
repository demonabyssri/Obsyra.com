// Obsyra-backend/src/middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('displayName').notEmpty().withMessage('El nombre es requerido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateProduct = [
    body('name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('images').isArray({ min: 1 }).withMessage('Se requiere al menos una imagen'),
    body('category').notEmpty().withMessage('La categoría es requerida'),
    body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
    body('sellingPrice').isFloat({ gt: 0 }).withMessage('El precio de venta debe ser un número positivo'),
    body('stock').isInt({ gt: -1 }).withMessage('El stock debe ser un número entero no negativo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateOrderItem = [
    body('items').isArray({ min: 1 }).withMessage('El pedido debe contener al menos un item.'),
    body('items.*.productId').notEmpty().withMessage('ID de producto requerido.'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Cantidad debe ser un número positivo.'),
    body('items.*.name').notEmpty().withMessage('Nombre del producto requerido en el item.'),
    body('items.*.price').isFloat({ gt: 0 }).withMessage('Precio del item debe ser un número positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateRegistration, validateProduct, validateOrderItem };