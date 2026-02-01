import mongoose from 'mongoose';

const commoditySchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide commodity name'],
        trim: true
    },
    nameTranslations: {
        type: Map,
        of: String,
        default: new Map()
    },
    category: {
        type: String,
        enum: ['vegetables', 'fruits', 'grains', 'spices', 'pulses', 'others'],
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        enum: ['kg', 'quintal', 'ton', 'piece'],
        default: 'kg'
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: [0, 'Price cannot be negative']
    },
    aiSuggestedPrice: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        confidence: {
            type: Number
        },
        factors: [{
            type: {
                type: String
            },
            description: String,
            impact: {
                type: String,
                enum: ['high', 'medium', 'low']
            }
        }],
        reasoning: String,
        generatedAt: Date
    },
    quality: {
        type: String,
        enum: ['A-Grade', 'Premium', 'Standard', 'B-Grade'],
        default: 'Standard'
    },
    images: [{
        type: String // URLs to images
    }],
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired', 'inactive'],
        default: 'active'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
}, {
    timestamps: true
});

// Index for search and filtering
commoditySchema.index({ name: 'text', description: 'text' });
commoditySchema.index({ category: 1, status: 1 });
commoditySchema.index({ vendor: 1, status: 1 });
commoditySchema.index({ createdAt: -1 });

// Auto-expire commodities
commoditySchema.pre('save', function (next) {
    if (this.expiresAt < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

const Commodity = mongoose.model('Commodity', commoditySchema);

export default Commodity;
