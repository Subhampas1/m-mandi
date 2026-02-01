import express from 'express';
import {
    getCommodities,
    getCommodity,
    createCommodity,
    updateCommodity,
    deleteCommodity,
    getVendorCommodities
} from '../controllers/commodityController.js';
import { protect, authorize } from '../middleware/auth.js';
import { commodityValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getCommodities);
router.get('/:id', getCommodity);
router.get('/vendor/:vendorId', getVendorCommodities);

// Protected routes (Vendor only)
router.post('/', protect, authorize('vendor', 'both'), commodityValidation, validate, createCommodity);
router.put('/:id', protect, authorize('vendor', 'both'), updateCommodity);
router.delete('/:id', protect, authorize('vendor', 'both'), deleteCommodity);

export default router;
