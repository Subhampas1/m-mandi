import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalText: {
        type: String,
        required: true
    },
    originalLanguage: {
        type: String,
        required: true
    },
    translations: {
        type: Map,
        of: String,
        default: new Map()
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const negotiationSchema = new mongoose.Schema({
    commodity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commodity',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema],
    currentOffer: {
        price: Number,
        quantity: Number,
        unit: String,
        proposedBy: {
            type: String,
            enum: ['vendor', 'buyer']
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        timestamp: Date
    },
    vendorCounter: Number,
    buyerCounter: Number,
    aiSuggestions: [{
        forUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        suggestion: String,
        pricePoint: Number,
        reasoning: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'accepted', 'rejected', 'expired', 'cancelled'],
        default: 'active'
    },
    fairTradeScore: {
        type: Number,
        min: 0,
        max: 100
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

// Index for querying
negotiationSchema.index({ vendor: 1, status: 1 });
negotiationSchema.index({ buyer: 1, status: 1 });
negotiationSchema.index({ commodity: 1 });
negotiationSchema.index({ status: 1, createdAt: -1 });

// Calculate fair trade score based on price difference from AI suggestion
negotiationSchema.methods.calculateFairTradeScore = function (commodityData) {
    if (!commodityData.aiSuggestedPrice) {
        return 50; // Neutral score if no AI suggestion
    }

    const aiMidPrice = (commodityData.aiSuggestedPrice.min + commodityData.aiSuggestedPrice.max) / 2;
    const finalPrice = this.status === 'accepted' ?
        (this.vendorCounter || this.buyerCounter || this.currentOffer) :
        this.currentOffer;

    const difference = Math.abs(finalPrice - aiMidPrice);
    const percentageDiff = (difference / aiMidPrice) * 100;

    // Score decreases as price deviates from AI suggestion
    const score = Math.max(0, 100 - (percentageDiff * 2));

    return Math.round(score);
};

const Negotiation = mongoose.model('Negotiation', negotiationSchema);

export default Negotiation;
