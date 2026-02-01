import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { negotiationAPI } from '../services/api';
import { NegotiationRoom } from '../components/negotiation';
import useNegotiation from '../hooks/useNegotiation';
import Header from '../components/common/Header';

const VendorNegotiations = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [negotiations, setNegotiations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNegotiation, setSelectedNegotiation] = useState(null);

    useEffect(() => {
        fetchVendorNegotiations();
    }, []);

    const fetchVendorNegotiations = async () => {
        setLoading(true);
        try {
            const response = await negotiationAPI.getVendorNegotiations();
            setNegotiations(response.data.negotiations || []);
        } catch (error) {
            console.error('Error fetching vendor negotiations:', error);
        }
        setLoading(false);
    };

    const handleOpenNegotiation = (negotiation) => {
        setSelectedNegotiation(negotiation);
    };

    const handleCloseNegotiation = () => {
        setSelectedNegotiation(null);
        fetchVendorNegotiations(); // Refresh negotiations
    };

    return (
        <div className="min-h-screen bg-mandi-cream">
            <Header showLogout={true} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Negotiations</h1>
                        <p className="text-gray-600">Respond to buyer inquiries</p>
                    </div>
                    <button
                        onClick={() => navigate('/vendor')}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="spinner mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading negotiations...</p>
                    </div>
                ) : negotiations.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">No Active Negotiations</h3>
                        <p className="text-gray-600">
                            When buyers start negotiating for your products, they'll appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {negotiations.map((negotiation) => (
                            <div
                                key={negotiation._id}
                                className="card cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleOpenNegotiation(negotiation)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold">{negotiation.commodity?.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            with {negotiation.buyer?.name}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${negotiation.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : negotiation.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {negotiation.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
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

                                <div className="text-sm text-gray-500">
                                    {negotiation.messages?.length || 0} message(s)
                                </div>
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

export default VendorNegotiations;
