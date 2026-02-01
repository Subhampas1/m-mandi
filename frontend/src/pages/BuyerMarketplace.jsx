import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { commodityAPI, negotiationAPI } from '../services/api';
import { NegotiationRoom } from '../components/negotiation';
import useNegotiation from '../hooks/useNegotiation';
import Header from '../components/common/Header';
import VoiceInput from '../components/common/VoiceInput';

const BuyerMarketplace = () => {
    const { user } = useAuth();
    const { t, currentLanguage, languages } = useLanguage();
    const navigate = useNavigate();
    const [commodities, setCommodities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        search: ''
    });
    const [selectedNegotiation, setSelectedNegotiation] = useState(null);
    const [negotiationLoading, setNegotiationLoading] = useState(false);

    // Helper function to get commodity-specific icon
    const getCommodityIcon = (name, category) => {
        const nameNormalized = name?.toLowerCase().trim();

        // Specific commodity icons with keywords to match
        const commodityIcons = {
            // Fruits
            'apple': '🍎',
            'banana': '🍌',
            'mango': '🥭',
            'grape': '🍇',
            'orange': '🍊',
            'strawberry': '🍓',
            'watermelon': '🍉',
            'pineapple': '🍍',
            'lemon': '🍋',
            'coconut': '🥥',
            'peach': '🍑',
            'cherry': '🍒',
            'pear': '🍐',
            'kiwi': '🥝',
            'avocado': '🥑',
            'pomegranate': '🍈',

            // Vegetables
            'tomato': '🍅',
            'potato': '🥔',
            'carrot': '🥕',
            'garlic': '🧄',
            'onion': '🧅',
            'corn': '🌽',
            'chilli': '🌶️',
            'chili': '🌶️',
            'pepper': '🫑',
            'broccoli': '🥦',
            'cucumber': '🥒',
            'eggplant': '🍆',
            'cabbage': '🥬',
            'lettuce': '🥬',
            'spinach': '🥬',
            'pumpkin': '🎃',
            'mushroom': '🍄',

            // Grains & Pulses
            'wheat': '🌾',
            'rice': '🍚',
            'basmati': '🍚',
            'maize': '🌽',
            'peanut': '🥜',
            'bean': '🫘',
            'lentil': '🫘',
            'chickpea': '🫘',
            'chana': '🫘',

            // Dairy
            'milk': '🥛',
            'cheese': '🧀',
            'butter': '🧈',

            // Others
            'honey': '🍯',
            'bread': '🍞',
            'egg': '🥚'
        };

        // Check if commodity name contains any of the keywords (not exact match)
        for (const [keyword, icon] of Object.entries(commodityIcons)) {
            if (nameNormalized.includes(keyword)) {
                return icon;
            }
        }

        // Fallback to category icons
        const categoryIcons = {
            'vegetables': '🥬',
            'fruits': '🍎',
            'grains': '🌾',
            'pulses': '🫘',
            'spices': '🌶️',
            'dairy': '🥛',
            'others': '📦'
        };

        return categoryIcons[category?.toLowerCase()] || '📦';
    };

    // Filtered commodities based on search
    const filteredCommodities = useMemo(() => {
        if (!filters.search) return commodities;

        const searchLower = filters.search.toLowerCase();
        return commodities.filter(commodity =>
            commodity.name.toLowerCase().includes(searchLower) ||
            commodity.category.toLowerCase().includes(searchLower) ||
            (commodity.description && commodity.description.toLowerCase().includes(searchLower)) ||
            commodity.location.toLowerCase().includes(searchLower)
        );
    }, [commodities, filters.search]);

    useEffect(() => {
        fetchCommodities();
    }, [filters.category]);

    const fetchCommodities = async () => {
        setLoading(true);
        try {
            const response = await commodityAPI.getAll({
                category: filters.category,
                status: 'active'
            });
            setCommodities(response.data.commodities);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
        setLoading(false);
    };

    const handleStartNegotiation = async (commodity) => {
        setNegotiationLoading(true);
        try {
            const response = await negotiationAPI.create({
                commodity: commodity._id,
                vendor: commodity.vendor
            });
            setSelectedNegotiation(response.data.data);
        } catch (error) {
            console.error('Error starting negotiation:', error);
            alert('Failed to start negotiation. Please try again.');
        }
        setNegotiationLoading(false);
    };

    const handleCloseNegotiation = () => {
        setSelectedNegotiation(null);
        fetchCommodities();
    };

    return (
        <div className="min-h-screen bg-mandi-cream">
            {/* Header */}
            <Header showLogout={true} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Title & Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{t('marketplace')}</h1>
                    <button
                        onClick={() => navigate('/buyer/negotiations')}
                        className="bg-white text-saffron-600 border-2 border-saffron-600 px-6 py-2 rounded-xl font-bold hover:bg-saffron-50 transition-colors flex items-center gap-2"
                    >
                        💬 {t('myNegotiations') || 'My Negotiations'}
                    </button>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        {/* Search Bar - Takes more space */}
                        <div className="flex-[3] relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder={`${t('search')} ${t('commodities')}...`}
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="input-field w-full pl-12 pr-12 py-3 text-lg"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                                <VoiceInput
                                    onTranscript={(text) => setFilters(prev => ({ ...prev, search: text }))}
                                    language={languages.find(l => l.code === currentLanguage)?.speechCode || 'en-IN'}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex-[1]">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="input-field w-full py-3 px-3 text-base"
                            >
                                <option value="">{t('category')}</option>
                                <option value="vegetables">🥬 {t('vegetables')}</option>
                                <option value="fruits">🍎 {t('fruits')}</option>
                                <option value="grains">🌾 {t('grains')}</option>
                                <option value="spices">🌶️ {t('spices')}</option>
                                <option value="pulses">🫘 {t('pulses')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results summary */}
                {filters.search && (
                    <div className="mb-4 text-sm text-gray-600">
                        {filteredCommodities.length} {filteredCommodities.length === 1 ? 'result' : 'results'} found for "{filters.search}"
                    </div>
                )}

                {/* Commodities Grid */}
                <h2 className="text-2xl font-bold mb-6">{t('availableCommodities')}</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t('loading')}</p>
                    </div>
                ) : filteredCommodities.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No Commodities Found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search
                                ? `No commodities found matching "${filters.search}"`
                                : 'No commodities found matching your criteria.'}
                        </p>
                        {(filters.search || filters.category) && (
                            <button
                                onClick={() => setFilters({ category: '', search: '' })}
                                className="btn-secondary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommodities.map((commodity) => (
                            <div key={commodity._id} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl">{getCommodityIcon(commodity.name, commodity.category)}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">{t(commodity.name) || commodity.name}</h3>
                                            <p className="text-sm text-gray-600 capitalize">{t(commodity.category)}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                                        {commodity.quality}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('quantity')}:</span>
                                        <span className="font-semibold">
                                            {commodity.quantity} {t(commodity.unit)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('price')}:</span>
                                        <span className="text-lg font-bold text-saffron-600">
                                            ₹{commodity.price}/{t(commodity.unit)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t('location')}:</span>
                                        <span className="text-sm">📍 {commodity.location}</span>
                                    </div>
                                </div>

                                {commodity.aiSuggestedPrice && (
                                    <div className="mb-4 p-2 bg-saffron-50 rounded-lg text-xs border border-saffron-200">
                                        <span className="text-saffron-700 font-medium">✨ {t('aiPriceSuggestion')}: </span>
                                        <span className="font-semibold">
                                            ₹{commodity.aiSuggestedPrice.min}-₹{commodity.aiSuggestedPrice.max}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleStartNegotiation(commodity)}
                                    disabled={negotiationLoading || user.role === 'vendor'}
                                    className={`w-full text-sm ${user.role === 'vendor'
                                        ? 'btn-secondary cursor-not-allowed opacity-60'
                                        : 'btn-primary'
                                        }`}
                                    title={user.role === 'vendor' ? 'Vendors cannot start negotiations' : ''}
                                >
                                    {user.role === 'vendor'
                                        ? '👁️ View Only (Vendors Cannot Negotiate)'
                                        : negotiationLoading
                                            ? `${t('loading')}...`
                                            : `🤝 ${t('startNegotiation')}`
                                    }
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Negotiation Room Modal */}
            {selectedNegotiation && (
                <NegotiationRoomWrapper
                    negotiation={selectedNegotiation}
                    currentUser={user}
                    onClose={handleCloseNegotiation}
                />
            )}
        </div>
    );
};

// Wrapper component to use the negotiation hook
const NegotiationRoomWrapper = ({ negotiation, currentUser, onClose }) => {
    const {
        messages,
        currentOffer,
        status,
        fairTradeScore,
        sendMessage,
        sendOffer,
        acceptOffer
    } = useNegotiation(negotiation._id);

    return (
        <NegotiationRoom
            negotiation={{
                ...negotiation,
                messages,
                currentOffer,
                status,
                fairTradeScore
            }}
            currentUser={currentUser}
            onSendMessage={sendMessage}
            onSendOffer={sendOffer}
            onAcceptOffer={acceptOffer}
            onClose={onClose}
        />
    );
};

export default BuyerMarketplace;
