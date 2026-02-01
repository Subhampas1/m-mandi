// API base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Language configurations
export const LANGUAGES = [
    { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', speechCode: 'hi-IN', aliases: ['hindi', 'हिंदी', 'हिन्दी'] },
    { code: 'english', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-IN', aliases: ['english', 'अंग्रेजी', 'इंग्लिश'] },
    { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN', aliases: ['tamil', 'தமிழ்', 'तमिल'] },
    { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN', aliases: ['telugu', 'తెలుగు', 'तेलुगु'] },
    { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechCode: 'bn-IN', aliases: ['bengali', 'বাংলা', 'बंगाली'] },
    { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN', aliases: ['marathi', 'मराठी'] },
    { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechCode: 'gu-IN', aliases: ['gujarati', 'ગુજરાતી', 'गुजराती'] },
    { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN', aliases: ['kannada', 'ಕನ್ನಡ', 'कन्नड़'] },
    { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN', aliases: ['malayalam', 'മലയാളം', 'मलियालम'] },
    { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechCode: 'pa-IN', aliases: ['punjabi', 'ਪੰਜਾਬੀ', 'पंजाबी'] },
    { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', speechCode: 'or-IN', aliases: ['odia', 'ଓଡ଼ିଆ', 'उड़िया'] },
    { code: 'urdu', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', speechCode: 'ur-IN', aliases: ['urdu', 'اردو', 'उर्दू'] },
];

// Commodity categories
export const CATEGORIES = [
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'grains', label: 'Grains', icon: '🌾' },
    { value: 'spices', label: 'Spices', icon: '🌶️' },
    { value: 'pulses', label: 'Pulses', icon: '🫘' },
    { value: 'others', label: 'Others', icon: '📦' }
];

// Quality grades
export const QUALITY_GRADES = [
    { value: 'A-Grade', label: 'A-Grade (Premium)' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Standard', label: 'Standard' },
    { value: 'B-Grade', label: 'B-Grade' }
];

// Units
export const UNITS = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'quintal', label: 'Quintals' },
    { value: 'ton', label: 'Tons' },
    { value: 'piece', label: 'Pieces' }
];

// User roles
export const ROLES = [
    { value: 'vendor', label: 'Vendor', icon: '🧑‍🌾', description: 'I want to sell my products' },
    { value: 'buyer', label: 'Buyer', icon: '🧑‍💼', description: 'I want to buy products' },
    { value: 'both', label: 'Both', icon: '🤝', description: 'I want to buy and sell' }
];
