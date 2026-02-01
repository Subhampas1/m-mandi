import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [activeNegotiations, setActiveNegotiations] = useState(new Set());
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Disconnect if not authenticated
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        // Create socket connection
        const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

        const newSocket = io(SOCKET_URL, {
            auth: {
                token: localStorage.getItem('token')
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnected(false);
        });

        // Listen for negotiation room joined confirmation
        newSocket.on('negotiation-joined', (data) => {
            console.log('✅ Successfully joined negotiation room:', data.negotiationId);
        });

        // Listen for errors
        newSocket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });

        // Set socket
        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, user]);

    // Join a negotiation room
    const joinNegotiation = (negotiationId) => {
        console.log('🚪 Attempting to join negotiation room:', { negotiationId, connected, socketExists: !!socket });
        if (socket && connected) {
            console.log('✅ Emitting join-negotiation event');
            socket.emit('join-negotiation', negotiationId);
            setActiveNegotiations(prev => new Set(prev).add(negotiationId));
        } else {
            console.error('❌ Cannot join negotiation - Socket not connected');
        }
    };

    // Leave a negotiation room
    const leaveNegotiation = (negotiationId) => {
        if (socket && connected) {
            socket.emit('leave-negotiation', negotiationId);
            setActiveNegotiations(prev => {
                const newSet = new Set(prev);
                newSet.delete(negotiationId);
                return newSet;
            });
        }
    };

    // Send a message in negotiation
    const sendMessage = (negotiationId, message) => {
        console.log('📨 Attempting to send message:', { negotiationId, message, connected, socketExists: !!socket });
        if (socket && connected) {
            console.log('✅ Emitting negotiation-message event');
            socket.emit('negotiation-message', {
                negotiationId,
                text: message
            });
        } else {
            console.error('❌ Cannot send message - Socket not connected');
        }
    };

    // Send an offer
    const sendOffer = (negotiationId, offerData) => {
        console.log('💰 Attempting to send offer:', { negotiationId, offerData, connected, socketExists: !!socket });
        if (socket && connected) {
            console.log('✅ Emitting negotiation-offer event');
            socket.emit('negotiation-offer', {
                negotiationId,
                ...offerData
            });
        } else {
            console.error('❌ Cannot send offer - Socket not connected');
        }
    };

    // Accept an offer
    const acceptOffer = (negotiationId, offerId) => {
        if (socket && connected) {
            socket.emit('accept-offer', {
                negotiationId,
                offerId
            });
        }
    };

    // Subscribe to negotiation events
    const onMessage = (callback) => {
        if (socket) {
            socket.on('new-message', callback);
            return () => socket.off('new-message', callback);
        }
    };

    const onOffer = (callback) => {
        if (socket) {
            socket.on('new-offer', callback);
            return () => socket.off('new-offer', callback);
        }
    };

    const onOfferAccepted = (callback) => {
        if (socket) {
            socket.on('offer-accepted', callback);
            return () => socket.off('offer-accepted', callback);
        }
    };

    const onStatusUpdate = (callback) => {
        if (socket) {
            socket.on('negotiation-status', callback);
            return () => socket.off('negotiation-status', callback);
        }
    };

    const onUserOnline = (callback) => {
        if (socket) {
            socket.on('user-online', callback);
            return () => socket.off('user-online', callback);
        }
    };

    const onUserOffline = (callback) => {
        if (socket) {
            socket.on('user-offline', callback);
            return () => socket.off('user-offline', callback);
        }
    };

    const value = {
        socket,
        connected,
        activeNegotiations: Array.from(activeNegotiations),

        // Actions
        joinNegotiation,
        leaveNegotiation,
        sendMessage,
        sendOffer,
        acceptOffer,

        // Event subscriptions
        onMessage,
        onOffer,
        onOfferAccepted,
        onStatusUpdate,
        onUserOnline,
        onUserOffline
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
