import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
    },
    role: {
        type: String,
        enum: ['vendor', 'buyer', 'both'],
        default: 'both'
    },
    preferredLanguage: {
        type: String,
        enum: ['hindi', 'english', 'tamil', 'bengali', 'marathi', 'telugu', 'gujarati', 'kannada', 'malayalam', 'punjabi', 'odia', 'urdu'],
        default: 'hindi'
    },
    location: {
        state: String,
        district: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String // URL to avatar image
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
