import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Validation rules
export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['vendor', 'buyer', 'both']).withMessage('Invalid role'),
    body('preferredLanguage').optional().isIn(['hindi', 'english', 'tamil', 'bengali', 'marathi', 'telugu', 'gujarati', 'kannada', 'malayalam', 'punjabi'])
];

export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

export const commodityValidation = [
    body('name').trim().notEmpty().withMessage('Commodity name is required'),
    body('category').isIn(['vegetables', 'fruits', 'grains', 'spices', 'pulses', 'others']).withMessage('Invalid category'),
    body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('unit').optional().isIn(['kg', 'quintal', 'ton', 'piece']),
    body('quality').optional().isIn(['A-Grade', 'Premium', 'Standard', 'B-Grade']),
    body('location').trim().notEmpty().withMessage('Location is required')
];

export const negotiationValidation = [
    body('commodityId').notEmpty().withMessage('Commodity ID is required'),
    body('initialOffer').isFloat({ min: 0 }).withMessage('Initial offer must be a positive number')
];
