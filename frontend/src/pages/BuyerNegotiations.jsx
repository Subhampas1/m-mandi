import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { negotiationAPI } from '../services/api';
import { NegotiationRoom } from '../components/negotiation';
import useNegotiation from '../hooks/useNegotiation';
import Header from '../components/common/Header';

const BuyerNegotiations = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [negotiations, setNegotiations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNegotiation, setSelectedNegotiation] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, accepted, rejected, pending

    useEffect(() => {
        fetchNegotiations();
    }, []);

    const fetchNegotiations = async () => {
        setLoading(true);
        try {
            const response = await negotiationAPI.getBuyerNegotiations();
            setNegotiations(response.data.negotiations || []);
        } catch (error) {
            console.error('Error fetching negotiations:', error);
        }
        setLoading(false);
    };

    const handleCloseNegotiation = () => {
        setSelectedNegotiation(null);
        fetchNegotiations(); // Refresh list
    };

    // Filter negotiations based on selected status
    const filteredNegotiations = negotiations.filter(neg => {
        if (statusFilter === 'all') return true;
        return neg.status === statusFilter;
    });

    // Status badge colors
    const getStatusBadge = (status) => {
        const badges = {
            active: { color: 'bg-blue-100 text-blue-800', icon: '🔵', label: 'Active' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', label: 'Pending' },
            accepted: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Accepted' },
            rejected: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Rejected' }
        };
        return badges[status] || { color: 'bg-gray-100 text-gray-800', icon: '⚪', label: status };
    };

    // Format relative time
    const getRelativeTime = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return then.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-mandi-cream">
            {/* Header */}
            <Header showLogout={true} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">💬 My Negotiations</h1>
                        <p className="text-gray-600 mt-1">View and manage all your negotiation history</p>
                    </div>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="btn-secondary"
                    >
                        🛒 Back to Marketplace
                    </button>
                </div>

                {/* Status Filters */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { value: 'all', label: 'All', icon: '📋' },
                            { value: 'active', label: 'Active', icon: '🔵' },
                            { value: 'pending', label: 'Pending', icon: '🟡' },
                            { value: 'accepted', label: 'Accepted', icon: '🟢' },
                            { value: 'rejected', label: 'Rejected', icon: '🔴' }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setStatusFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === filter.value
                                        ? 'bg-saffron-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.icon} {filter.label}
                                <span className="ml-2 text-xs opacity-75">
                                    ({negotiations.filter(n => filter.value === 'all' || n.status === filter.value).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Negotiations List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading negotiations...</p>
                    </div>
                ) : filteredNegotiations.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">
                            No {statusFilter !== 'all' ? statusFilter : ''} Negotiations
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {statusFilter === 'all'
                                ? 'Start negotiating with vendors from the marketplace'
                                : `You don't have any ${statusFilter} negotiations`}
                        </p>
                        <button
                            onClick={() => statusFilter === 'all' ? navigate('/marketplace') : setStatusFilter('all')}
                            className="btn-primary"
                        >
                            {statusFilter === 'all' ? 'Browse Marketplace' : 'View All Negotiations'}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNegotiations.map((negotiation) => {
                            const statusBadge = getStatusBadge(negotiation.status);
                            return (
                                <div
                                    key={negotiation._id}
                                    className="card cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    onClick={() => setSelectedNegotiation(negotiation)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                                {negotiation.commodity?.name || 'Unknown Commodity'}
                                            </h3>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {negotiation.commodity?.category}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full font-semibold uppercase ${statusBadge.color}`}>
                                            {statusBadge.icon} {statusBadge.label}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Vendor:</span>
                                            <span className="font-semibold">{negotiation.vendor?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Quantity:</span>
                                            <span className="font-semibold">
                                                {negotiation.commodity?.quantity} {negotiation.commodity?.unit}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Listed Price:</span>
                                            <span className="font-semibold text-saffron-600">
                                                ₹{negotiation.commodity?.price}/{negotiation.commodity?.unit}
                                            </span>
                                        </div>
                                        {negotiation.currentOffer && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Current Offer:</span>
                                                <span className="font-semibold text-blue-600">
                                                    ₹{negotiation.currentOffer.price}/{negotiation.commodity?.unit}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">
                                            💬 {negotiation.messages?.length || 0} message(s)
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {getRelativeTime(negotiation.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
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

export default BuyerNegotiations;
