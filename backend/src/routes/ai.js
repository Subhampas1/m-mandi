import express from 'express';
import {
    getPriceSuggestion,
    translate,
    getNegotiationAssist
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// AI price discovery - protected
router.post('/price-discovery', protect, getPriceSuggestion);

// Translation - public (for accessibility)
router.post('/translate', translate);

// Negotiation assistance - protected
router.post('/negotiation-assist', protect, getNegotiationAssist);

export default router;
