import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import User from './models/User.js';
import Commodity from './models/Commodity.js';
import Negotiation from './models/Negotiation.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected for seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Mock Users
const mockUsers = [
    {
        name: 'Rajesh Kumar',
        email: 'vendor1@test.com',
        password: 'password123',
        role: 'vendor',
        preferredLanguage: 'hindi',
        location: 'Mumbai, Maharashtra'
    },
    {
        name: 'Priya Sharma',
        email: 'vendor2@test.com',
        password: 'password123',
        role: 'vendor',
        preferredLanguage: 'english',
        location: 'Pune, Maharashtra'
    },
    {
        name: 'Amit Patel',
        email: 'buyer1@test.com',
        password: 'password123',
        role: 'buyer',
        preferredLanguage: 'gujarati',
        location: 'Ahmedabad, Gujarat'
    },
    {
        name: 'Lakshmi Devi',
        email: 'buyer2@test.com',
        password: 'password123',
        role: 'buyer',
        preferredLanguage: 'tamil',
        location: 'Chennai, Tamil Nadu'
    },
    {
        name: 'Suresh Reddy',
        email: 'both@test.com',
        password: 'password123',
        role: 'both',
        preferredLanguage: 'telugu',
        location: 'Hyderabad, Telangana'
    }
];

// Mock Commodities
const getMockCommodities = (vendorIds) => [
    // Vegetables
    {
        vendor: vendorIds[0],
        name: 'Fresh Tomatoes',
        category: 'vegetables',
        quantity: 100,
        unit: 'kg',
        price: 45,
        quality: 'Premium',
        location: 'Mumbai, Maharashtra',
        description: 'Fresh, organic tomatoes. Perfect for cooking.',
        aiSuggestedPrice: { min: 40, max: 55, confidence: 85 },
        status: 'active'
    },
    {
        vendor: vendorIds[0],
        name: 'Onions',
        category: 'vegetables',
        quantity: 200,
        unit: 'kg',
        price: 30,
        quality: 'Standard',
        location: 'Mumbai, Maharashtra',
        description: 'High quality onions from local farms.',
        aiSuggestedPrice: { min: 25, max: 35, confidence: 80 },
        status: 'active'
    },
    {
        vendor: vendorIds[1],
        name: 'Potatoes',
        category: 'vegetables',
        quantity: 150,
        unit: 'kg',
        price: 25,
        quality: 'Standard',
        location: 'Pune, Maharashtra',
        description: 'Fresh potatoes, good for storage.',
        aiSuggestedPrice: { min: 20, max: 30, confidence: 75 },
        status: 'active'
    },
    {
        vendor: vendorIds[1],
        name: 'Green Chillies',
        category: 'vegetables',
        quantity: 50,
        unit: 'kg',
        price: 60,
        quality: 'Premium',
        location: 'Pune, Maharashtra',
        description: 'Spicy green chillies, freshly harvested.',
        aiSuggestedPrice: { min: 55, max: 70, confidence: 82 },
        status: 'active'
    },

    // Fruits
    {
        vendor: vendorIds[0],
        name: 'Alphonso Mangoes',
        category: 'fruits',
        quantity: 75,
        unit: 'kg',
        price: 250,
        quality: 'Premium',
        location: 'Ratnagiri, Maharashtra',
        description: 'King of mangoes! Premium Alphonso variety.',
        aiSuggestedPrice: { min: 220, max: 280, confidence: 90 },
        status: 'active'
    },
    {
        vendor: vendorIds[1],
        name: 'Bananas',
        category: 'fruits',
        quantity: 100,
        unit: 'kg',
        price: 40,
        quality: 'Standard',
        location: 'Pune, Maharashtra',
        description: 'Fresh bananas, perfect ripeness.',
        aiSuggestedPrice: { min: 35, max: 50, confidence: 78 },
        status: 'active'
    },
    {
        vendor: vendorIds[2],
        name: 'Pomegranates',
        category: 'fruits',
        quantity: 60,
        unit: 'kg',
        price: 120,
        quality: 'Premium',
        location: 'Hyderabad, Telangana',
        description: 'Juicy, sweet pomegranates.',
        aiSuggestedPrice: { min: 100, max: 140, confidence: 83 },
        status: 'active'
    },

    // Grains
    {
        vendor: vendorIds[2],
        name: 'Basmati Rice',
        category: 'grains',
        quantity: 500,
        unit: 'kg',
        price: 80,
        quality: 'Premium',
        location: 'Hyderabad, Telangana',
        description: 'Aged Basmati rice with long grains.',
        aiSuggestedPrice: { min: 75, max: 95, confidence: 87 },
        status: 'active'
    },
    {
        vendor: vendorIds[1],
        name: 'Wheat',
        category: 'grains',
        quantity: 300,
        unit: 'kg',
        price: 35,
        quality: 'Standard',
        location: 'Pune, Maharashtra',
        description: 'High-quality wheat for flour milling.',
        aiSuggestedPrice: { min: 30, max: 40, confidence: 80 },
        status: 'active'
    },

    // Pulses
    {
        vendor: vendorIds[0],
        name: 'Toor Dal',
        category: 'pulses',
        quantity: 200,
        unit: 'kg',
        price: 120,
        quality: 'Premium',
        location: 'Mumbai, Maharashtra',
        description: 'Premium quality pigeon peas.',
        aiSuggestedPrice: { min: 110, max: 135, confidence: 85 },
        status: 'active'
    },
    {
        vendor: vendorIds[2],
        name: 'Moong Dal',
        category: 'pulses',
        quantity: 150,
        unit: 'kg',
        price: 140,
        quality: 'Standard',
        location: 'Hyderabad, Telangana',
        description: 'Green gram split, fresh crop.',
        aiSuggestedPrice: { min: 130, max: 155, confidence: 82 },
        status: 'active'
    },

    // Spices
    {
        vendor: vendorIds[1],
        name: 'Turmeric Powder',
        category: 'spices',
        quantity: 80,
        unit: 'kg',
        price: 280,
        quality: 'Premium',
        location: 'Pune, Maharashtra',
        description: 'Pure turmeric powder, high curcumin content.',
        aiSuggestedPrice: { min: 250, max: 320, confidence: 88 },
        status: 'active'
    },
    {
        vendor: vendorIds[0],
        name: 'Red Chilli Powder',
        category: 'spices',
        quantity: 100,
        unit: 'kg',
        price: 350,
        quality: 'Premium',
        location: 'Mumbai, Maharashtra',
        description: 'Spicy red chilli powder, premium grade.',
        aiSuggestedPrice: { min: 320, max: 380, confidence: 86 },
        status: 'active'
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('\n🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Commodity.deleteMany({});
        await Negotiation.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create users
        console.log('👥 Creating mock users...');
        const createdUsers = [];
        for (const userData of mockUsers) {
            const user = await User.create(userData);
            createdUsers.push(user);
            console.log(`   ✓ Created ${user.role}: ${user.name} (${user.email})`);
        }
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Get vendor IDs
        const vendorIds = createdUsers
            .filter(u => u.role === 'vendor' || u.role === 'both')
            .map(u => u._id);

        // Create commodities
        console.log('🌾 Creating mock commodities...');
        const commodities = getMockCommodities(vendorIds);
        const createdCommodities = await Commodity.insertMany(commodities);
        console.log(`✅ Created ${createdCommodities.length} commodities\n`);

        // Summary
        console.log('📊 Seeding Summary:');
        console.log('─'.repeat(50));
        console.log(`   Users Created: ${createdUsers.length}`);
        console.log(`   - Vendors: ${createdUsers.filter(u => u.role === 'vendor').length}`);
        console.log(`   - Buyers: ${createdUsers.filter(u => u.role === 'buyer').length}`);
        console.log(`   - Both: ${createdUsers.filter(u => u.role === 'both').length}`);
        console.log(`   Commodities Created: ${createdCommodities.length}`);
        console.log('─'.repeat(50));

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📝 Test Credentials:');
        console.log('─'.repeat(50));
        mockUsers.forEach(user => {
            console.log(`   ${user.role.toUpperCase()}: ${user.email} / password123`);
        });
        console.log('─'.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder
connectDB().then(seedDatabase);
