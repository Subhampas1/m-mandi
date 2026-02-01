import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    negotiation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiation',
        required: true
    },
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
    finalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    completedAt: Date
}, {
    timestamps: true
});

// Index for queries
transactionSchema.index({ vendor: 1, status: 1 });
transactionSchema.index({ buyer: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

// Calculate total amount before saving
transactionSchema.pre('save', function (next) {
    if (this.isModified('finalPrice') || this.isModified('quantity')) {
        this.totalAmount = this.finalPrice * this.quantity;
    }
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
