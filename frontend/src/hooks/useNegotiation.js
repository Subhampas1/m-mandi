import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const useNegotiation = (negotiationId) => {
    const {
        connected,
        joinNegotiation,
        leaveNegotiation,
        sendMessage,
        sendOffer,
        acceptOffer,
        onMessage,
        onOffer,
        onOfferAccepted,
        onStatusUpdate
    } = useSocket();

    const [messages, setMessages] = useState([]);
    const [currentOffer, setCurrentOffer] = useState(null);
    const [status, setStatus] = useState('active');
    const [fairTradeScore, setFairTradeScore] = useState(null);

    useEffect(() => {
        if (!negotiationId || !connected) return;

        // Join negotiation room
        joinNegotiation(negotiationId);

        // Listen for new messages
        const unsubMessage = onMessage((data) => {
            if (data.negotiationId === negotiationId) {
                setMessages(prev => [...prev, data.message]);
            }
        });

        // Listen for new offers
        const unsubOffer = onOffer((data) => {
            if (data.negotiationId === negotiationId) {
                setCurrentOffer(data.offer);
                if (data.fairTradeScore !== undefined) {
                    setFairTradeScore(data.fairTradeScore);
                }
            }
        });

        // Listen for offer acceptance
        const unsubAccepted = onOfferAccepted((data) => {
            if (data.negotiationId === negotiationId) {
                setCurrentOffer(data.offer);
                setStatus('accepted');
            }
        });

        // Listen for status updates
        const unsubStatus = onStatusUpdate((data) => {
            if (data.negotiationId === negotiationId) {
                setStatus(data.status);
            }
        });

        // Cleanup
        return () => {
            leaveNegotiation(negotiationId);
            if (unsubMessage) unsubMessage();
            if (unsubOffer) unsubOffer();
            if (unsubAccepted) unsubAccepted();
            if (unsubStatus) unsubStatus();
        };
    }, [negotiationId, connected]);

    const handleSendMessage = (text) => {
        sendMessage(negotiationId, text);
    };

    const handleSendOffer = (offerData) => {
        sendOffer(negotiationId, offerData);
    };

    const handleAcceptOffer = () => {
        acceptOffer(negotiationId, currentOffer?.id);
    };

    return {
        connected,
        messages,
        currentOffer,
        status,
        fairTradeScore,
        sendMessage: handleSendMessage,
        sendOffer: handleSendOffer,
        acceptOffer: handleAcceptOffer
    };
};

export default useNegotiation;
