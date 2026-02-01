import express from 'express';
import { protect } from '../middleware/auth.js';
import Negotiation from '../models/Negotiation.js';
import Commodity from '../models/Commodity.js';

const router = express.Router();

// @route   POST /api/negotiations
// @desc    Start a new negotiation
// @access  Private (Buyer)
router.post('/', protect, async (req, res) => {
    try {
        const { commodity, vendor } = req.body;

        const commodityData = await Commodity.findById(commodity).populate('vendor');

        if (!commodityData) {
            return res.status(404).json({ message: 'Commodity not found' });
        }

        if (commodityData.status !== 'active') {
            return res.status(400).json({ message: 'Commodity is not available' });
        }

        // Check if negotiation already exists
        // Check if negotiation already exists (regardless of status - for history)
        let existingNegotiation = await Negotiation.findOne({
            commodity: commodity,
            buyer: req.user._id
        })
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone');

        if (existingNegotiation) {
            // Re-activate if it was rejected/cancelled/expired
            if (['rejected', 'cancelled', 'expired'].includes(existingNegotiation.status)) {
                existingNegotiation.status = 'active';
                await existingNegotiation.save();
            }

            return res.status(200).json({
                success: true,
                data: existingNegotiation,
                message: 'Continuing existing negotiation'
            });
        }

        // Create new negotiation
        const negotiation = await Negotiation.create({
            commodity: commodity,
            vendor: commodityData.vendor._id,
            buyer: req.user._id,
            currentOffer: commodityData.price, // Start with commodity's listed price
            messages: [],
            status: 'active'
        });

        const populatedNegotiation = await Negotiation.findById(negotiation._id)
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone');

        res.status(201).json({
            success: true,
            data: populatedNegotiation
        });
    } catch (error) {
        console.error('Error creating negotiation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/negotiations
// @desc    Get user's negotiations
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const negotiations = await Negotiation.find({
            $or: [
                { vendor: req.user._id },
                { buyer: req.user._id }
            ]
        })
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone')
            .sort('-updatedAt');

        res.json({
            success: true,
            count: negotiations.length,
            data: negotiations
        });
    } catch (error) {
        console.error('Error fetching negotiations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/negotiations/:id
// @desc    Get single negotiation
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const negotiation = await Negotiation.findById(req.params.id)
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone');

        if (!negotiation) {
            return res.status(404).json({ message: 'Negotiation not found' });
        }

        // Check authorization
        const isParticipant =
            negotiation.vendor._id.toString() === req.user._id.toString() ||
            negotiation.buyer._id.toString() === req.user._id.toString();

        if (!isParticipant) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json({
            success: true,
            data: negotiation
        });
    } catch (error) {
        console.error('Error fetching negotiation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/negotiations/:id/status
// @desc    Update negotiation status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const negotiation = await Negotiation.findById(req.params.id);

        if (!negotiation) {
            return res.status(404).json({ message: 'Negotiation not found' });
        }

        // Check authorization
        const isParticipant =
            negotiation.vendor.toString() === req.user._id.toString() ||
            negotiation.buyer.toString() === req.user._id.toString();

        if (!isParticipant) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        negotiation.status = status;
        await negotiation.save();

        res.json({
            success: true,
            data: negotiation
        });
    } catch (error) {
        console.error('Error updating negotiation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/negotiations/vendor/my-negotiations
// @desc    Get all vendor negotiations (all statuses)
// @access  Private (Vendor)
router.get('/vendor/my-negotiations', protect, async (req, res) => {
    try {
        const negotiations = await Negotiation.find({
            vendor: req.user._id
        })
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone')
            .sort({ updatedAt: -1, createdAt: -1 }); // Most recent first

        res.json({
            success: true,
            negotiations
        });
    } catch (error) {
        console.error('Error fetching vendor negotiations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/negotiations/buyer/my-negotiations
// @desc    Get all buyer negotiations (all statuses)
// @access  Private (Buyer)
router.get('/buyer/my-negotiations', protect, async (req, res) => {
    try {
        const negotiations = await Negotiation.find({
            buyer: req.user._id
        })
            .populate('commodity')
            .populate('vendor', 'name email phone')
            .populate('buyer', 'name email phone')
            .sort({ updatedAt: -1, createdAt: -1 }); // Most recent first

        res.json({
            success: true,
            negotiations
        });
    } catch (error) {
        console.error('Error fetching buyer negotiations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
