import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { commodityAPI, aiAPI } from '../services/api';
import VoiceInput from '../components/common/VoiceInput';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, currentLanguage, languages } = useLanguage();
    const [commodities, setCommodities] = useState([]);
    const [showPricePanel, setShowParam] = useState(false);
    const [aiPrice, setAiPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: 'vegetables',
        quantity: '',
        unit: 'kg',
        price: '',
        quality: 'Standard',
        location: ''
    });

    useEffect(() => {
        fetchMyCommodities();
    }, []);

    const fetchMyCommodities = async () => {
        try {
            const response = await commodityAPI.getByVendor(user._id);
            setCommodities(response.data.commodities);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetAIPrice = async () => {
        if (!formData.name || !formData.quantity || !formData.location) {
            alert(t('error')); // Using generic error for now, could be specific
            return;
        }

        setLoading(true);
        try {
            const response = await aiAPI.getPriceDiscovery({
                commodityName: formData.name,
                quantity: formData.quantity,
                unit: formData.unit,
                location: formData.location,
                quality: formData.quality
            });

            setAiPrice(response.data.data);
            setShowPricePanel(true);

            // Auto-fill price with mid-range
            const midPrice = (response.data.data.suggestedPrice.min + response.data.data.suggestedPrice.max) / 2;
            setFormData({ ...formData, price: Math.round(midPrice) });
        } catch (error) {
            alert('Failed to get AI price suggestion');
            console.error(error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await commodityAPI.create({
                ...formData,
                aiSuggestedPrice: aiPrice
            });

            alert('Commodity listed successfully!');

            // Reset form
            setFormData({
                name: '',
                category: 'vegetables',
                quantity: '',
                unit: 'kg',
                price: '',
                quality: 'Standard',
                location: ''
            });
            setShowPricePanel(false);
            setAiPrice(null);

            // Refresh list
            fetchMyCommodities();
        } catch (error) {
            alert('Failed to create commodity');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-mandi-cream">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🧑‍🌾</span>
                        <div>
                            <h1 className="text-xl font-bold">{t('vendorDashboard')}</h1>
                            <p className="text-sm text-gray-600">🗣️ {user?.preferredLanguage}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="px-4 py-2 bg-saffron-100 text-saffron-700 rounded-md hover:bg-saffron-200 transition-colors font-semibold"
                        >
                            🛒 {t('browseMarketplace')}
                        </button>
                        <button
                            onClick={() => navigate('/vendor/negotiations')}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors font-semibold"
                        >
                            💬 {t('viewNegotiations')}
                        </button>
                        <button onClick={logout} className="text-red-600 hover:text-red-700">
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Add Commodity Form */}
                    <div>
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6">{t('listYourCommodity')}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">{t('commodityName')}</label>
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-field flex-1"
                                            placeholder="e.g., Tomatoes, Rice, Wheat"
                                        />
                                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                            <VoiceInput
                                                onTranscript={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                                language={languages.find(l => l.code === currentLanguage)?.speechCode || 'en-IN'}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">{t('category')}</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="vegetables">🥬 {t('vegetables')}</option>
                                            <option value="fruits">🍎 {t('fruits')}</option>
                                            <option value="grains">🌾 {t('grains')}</option>
                                            <option value="spices">🌶️ {t('spices')}</option>
                                            <option value="pulses">🫘 {t('pulses')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">{t('quality')}</label>
                                        <select
                                            name="quality"
                                            value={formData.quality}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="A-Grade">{t('a-grade') || 'A-Grade'}</option>
                                            <option value="Premium">{t('premium') || 'Premium'}</option>
                                            <option value="Standard">{t('standard') || 'Standard'}</option>
                                            <option value="B-Grade">{t('b-grade') || 'B-Grade'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">{t('quantity')}</label>
                                        <div className="flex gap-2 relative">
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                className="input-field w-full"
                                            />
                                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                                <VoiceInput
                                                    onTranscript={(text) => setFormData(prev => ({ ...prev, quantity: text.replace(/[^0-9]/g, '') }))}
                                                    language={languages.find(l => l.code === currentLanguage)?.speechCode || 'en-IN'}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">{t('unit')}</label>
                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="kg">{t('kg')}</option>
                                            <option value="quintal">{t('quintal')}</option>
                                            <option value="ton">{t('ton')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{t('location')}</label>
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="input-field w-full"
                                            placeholder="City, State"
                                        />
                                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                            <VoiceInput
                                                onTranscript={(text) => setFormData(prev => ({ ...prev, location: text }))}
                                                language={languages.find(l => l.code === currentLanguage)?.speechCode || 'en-IN'}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGetAIPrice}
                                    disabled={loading}
                                    className="btn-secondary w-full"
                                >
                                    {loading ? t('analyzing') : `✨ ${t('getAIPriceSuggestion')}`}
                                </button>

                                {aiPrice && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">{t('yourPrice')} (₹/{t(formData.unit)})</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="input-field"
                                        />
                                        <p className="text-sm text-gray-600 mt-1">
                                            {t('aiSuggests')}: ₹{aiPrice.suggestedPrice.min} - ₹{aiPrice.suggestedPrice.max}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                    disabled={!aiPrice}
                                >
                                    {t('listCommodity')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: AI Price Panel or My Listings */}
                    <div>
                        {showPricePanel && aiPrice ? (
                            <div className="card bg-gradient-to-br from-saffron-50 to-white">
                                <div className="inline-block px-3 py-1 bg-saffron-600 text-white text-sm rounded-full mb-4">
                                    ✨ {t('aiPowered')}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{t('smartPriceDiscovery')}</h3>

                                <div className="mb-6">
                                    <div className="text-4xl font-bold text-saffron-600 mb-2">
                                        ₹{aiPrice.suggestedPrice.min} - ₹{aiPrice.suggestedPrice.max}
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        {aiPrice.confidence}% {t('confidence')}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold">📊 {t('whyThisPrice')}</h4>
                                    {aiPrice.factors.map((factor, index) => (
                                        <div key={index} className="bg-white p-3 rounded-lg">
                                            <div className="font-semibold text-sm">{factor.type.replace(/_/g, ' ').toUpperCase()}</div>
                                            <div className="text-sm text-gray-700">{factor.description}</div>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-4 text-sm text-gray-600">{aiPrice.reasoning}</p>
                            </div>
                        ) : (
                            <div className="card">
                                <h3 className="text-xl font-bold mb-4">{t('myActiveListings')}</h3>
                                {commodities.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">
                                        {t('noCommoditiesListed')}<br />{t('addFirstCommodity')}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {commodities.map((commodity) => (
                                            <div key={commodity._id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold">{t(commodity.name) || commodity.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {commodity.quantity} {t(commodity.unit)} • {t(commodity.quality)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-saffron-600">
                                                            ₹{commodity.price}/{t(commodity.unit)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{commodity.location}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
