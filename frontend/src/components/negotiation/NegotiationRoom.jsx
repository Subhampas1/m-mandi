import { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import MessageBubble from './MessageBubble';
import OfferCard from './OfferCard';
import VoiceInput from '../common/VoiceInput';
import { useLanguage } from '../../context/LanguageContext';

const NegotiationRoom = ({
    negotiation,
    currentUser,
    onSendMessage,
    onSendOffer,
    onAcceptOffer,
    onClose
}) => {
    const [messageText, setMessageText] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [showOfferForm, setShowOfferForm] = useState(false);
    const messagesEndRef = useRef(null);
    const { currentLanguage, languages } = useLanguage();

    // Get speech recognition language code based on current app language
    const speechLanguage = languages.find(l => l.code === currentLanguage)?.speechCode || 'en-IN';

    const handleTranscript = (text) => {
        setMessageText(prev => prev ? `${prev} ${text}` : text);
    };

    // Add console log to debug
    useEffect(() => {
        console.log('NegotiationRoom received data:', negotiation);
    }, [negotiation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [negotiation.messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText('');
        }
    };

    const handleSendOffer = (e) => {
        e.preventDefault();
        if (offerPrice && parseFloat(offerPrice) > 0) {
            onSendOffer({
                price: parseFloat(offerPrice),
                quantity: negotiation.commodity?.quantity || 0,
                unit: negotiation.commodity?.unit || 'unit'
            });
            setOfferPrice('');
            setShowOfferForm(false);
        }
    };

    const isVendor = currentUser._id === negotiation.vendor?._id;

    // Safety checks
    if (!negotiation.commodity) {
        return <div className="text-center p-8">Loading negotiation details...</div>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">{negotiation.commodity?.name || 'Unknown Commodity'}</h2>
                        <p className="text-sm text-gray-600">
                            Negotiating with {isVendor ? (negotiation.buyer?.name || 'Buyer') : (negotiation.vendor?.name || 'Vendor')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Commodity Info */}
                <div className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm">
                            <span className="text-gray-600">Quantity:</span>{' '}
                            <span className="font-semibold">
                                {negotiation.commodity?.quantity || 0} {negotiation.commodity?.unit || 'unit'}
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">Listed Price:</span>{' '}
                            <span className="font-semibold text-saffron-600">
                                ₹{negotiation.commodity?.price || 0}/{negotiation.commodity?.unit || 'unit'}
                            </span>
                        </div>
                        {negotiation.fairTradeScore && (
                            <div className="text-sm">
                                <span className="text-gray-600">Fair Trade Score:</span>{' '}
                                <span className="font-semibold text-green-600">
                                    {negotiation.fairTradeScore}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {negotiation.messages && negotiation.messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            message={msg}
                            isOwn={msg.sender === currentUser._id}
                            timestamp={msg.timestamp}
                        />
                    ))}

                    {/* Current Offer */}
                    {negotiation.currentOffer && (
                        <div className="my-4">
                            <OfferCard
                                offer={negotiation.currentOffer}
                                onAccept={onAcceptOffer}
                                onCounter={() => setShowOfferForm(true)}
                                isVendor={isVendor}
                            />
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                    {showOfferForm ? (
                        <form onSubmit={handleSendOffer} className="space-y-3">
                            <Input
                                label="Your Counter Offer (₹ per unit)"
                                type="number"
                                name="offerPrice"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                placeholder="Enter price"
                                required
                            />
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" fullWidth>
                                    Send Offer
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowOfferForm(false)}
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-saffron-500 focus:outline-none"
                            />
                            <Button type="submit" variant="primary">
                                Send
                            </Button>
                            <VoiceInput
                                onTranscript={handleTranscript}
                                language={speechLanguage}
                            />
                            {!negotiation.currentOffer && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowOfferForm(true)}
                                >
                                    Make Offer
                                </Button>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NegotiationRoom;
