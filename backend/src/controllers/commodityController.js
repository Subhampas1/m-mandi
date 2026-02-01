import Commodity from '../models/Commodity.js';
import { translateToMultiple } from '../config/translate.js';

// @desc    Get all commodities
// @route   GET /api/commodities
// @access  Public
export const getCommodities = async (req, res) => {
    try {
        const { category, status, search, minPrice, maxPrice, limit = 20, page = 1 } = req.query;

        const query = {};

        // Filters
        if (category) query.category = category;
        if (status) query.status = status;
        else query.status = 'active'; // Default to active commodities

        if (search) {
            query.$text = { $search: search };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const commodities = await Commodity.find(query)
            .populate('vendor', 'name location preferredLanguage')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Commodity.countDocuments(query);

        res.json({
            success: true,
            count: commodities.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            commodities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single commodity
// @route   GET /api/commodities/:id
// @access  Public
export const getCommodity = async (req, res) => {
    try {
        const commodity = await Commodity.findById(req.params.id)
            .populate('vendor', 'name phone location preferredLanguage');

        if (!commodity) {
            return res.status(404).json({
                success: false,
                message: 'Commodity not found'
            });
        }

        res.json({
            success: true,
            commodity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create commodity
// @route   POST /api/commodities
// @access  Private (Vendor only)
export const createCommodity = async (req, res) => {
    try {
        const { name, category, quantity, unit, price, quality, description, location, aiSuggestedPrice } = req.body;

        // Try to translate commodity name to multiple languages
        let translations = new Map();
        try {
            const supportedLanguages = ['hindi', 'tamil', 'bengali', 'marathi', 'telugu'];
            translations = await translateToMultiple(name, supportedLanguages, 'english');
            console.log('✅ Translations generated successfully');
        } catch (translationError) {
            console.log('⚠️ Translation failed, continuing without translations:', translationError.message);
            // Continue with empty translations - not critical
        }

        const commodity = await Commodity.create({
            vendor: req.user.id,
            name,
            nameTranslations: translations,
            category,
            quantity,
            unit,
            price,
            quality,
            description,
            location,
            aiSuggestedPrice: aiSuggestedPrice ? {
                min: aiSuggestedPrice.suggestedPrice?.min || aiSuggestedPrice.min,
                max: aiSuggestedPrice.suggestedPrice?.max || aiSuggestedPrice.max,
                confidence: aiSuggestedPrice.confidence,
                factors: aiSuggestedPrice.factors,
                reasoning: aiSuggestedPrice.reasoning,
                generatedAt: new Date()
            } : undefined
        });

        res.status(201).json({
            success: true,
            message: 'Commodity created successfully',
            commodity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update commodity
// @route   PUT /api/commodities/:id
// @access  Private (Vendor only - own commodities)
export const updateCommodity = async (req, res) => {
    try {
        let commodity = await Commodity.findById(req.params.id);

        if (!commodity) {
            return res.status(404).json({
                success: false,
                message: 'Commodity not found'
            });
        }

        // Check ownership
        if (commodity.vendor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this commodity'
            });
        }

        commodity = await Commodity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Commodity updated successfully',
            commodity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete commodity
// @route   DELETE /api/commodities/:id
// @access  Private (Vendor only - own commodities)
export const deleteCommodity = async (req, res) => {
    try {
        const commodity = await Commodity.findById(req.params.id);

        if (!commodity) {
            return res.status(404).json({
                success: false,
                message: 'Commodity not found'
            });
        }

        // Check ownership
        if (commodity.vendor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this commodity'
            });
        }

        await commodity.deleteOne();

        res.json({
            success: true,
            message: 'Commodity deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get vendor's commodities
// @route   GET /api/commodities/vendor/:vendorId
// @access  Public
export const getVendorCommodities = async (req, res) => {
    try {
        const commodities = await Commodity.find({
            vendor: req.params.vendorId,
            status: 'active'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: commodities.length,
            commodities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
