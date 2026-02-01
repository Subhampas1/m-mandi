import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Negotiation from '../models/Negotiation.js';

let io;

// Initialize Socket.io
const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

        // User joins their personal room
        socket.join(`user:${socket.userId}`);

        // Broadcast user online status
        socket.broadcast.emit('user-online', {
            userId: socket.userId,
            name: socket.user.name
        });

        // Join negotiation room
        socket.on('join-negotiation', async (negotiationId) => {
            try {
                const negotiation = await Negotiation.findById(negotiationId);

                if (!negotiation) {
                    socket.emit('error', { message: 'Negotiation not found' });
                    return;
                }

                // Verify user is part of negotiation
                const isParticipant =
                    negotiation.vendor.toString() === socket.userId ||
                    negotiation.buyer.toString() === socket.userId;

                if (!isParticipant) {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                socket.join(`negotiation:${negotiationId}`);
                console.log(`User ${socket.user.name} joined negotiation ${negotiationId}`);

                // Send negotiation state
                socket.emit('negotiation-joined', {
                    negotiationId,
                    negotiation
                });
            } catch (error) {
                console.error('Error joining negotiation:', error);
                socket.emit('error', { message: 'Failed to join negotiation' });
            }
        });

        // Leave negotiation room
        socket.on('leave-negotiation', (negotiationId) => {
            socket.leave(`negotiation:${negotiationId}`);
            console.log(`User ${socket.user.name} left negotiation ${negotiationId}`);
        });

        // Handle new message
        socket.on('negotiation-message', async (data) => {
            try {
                console.log('📨 Backend received message:', data);
                const { negotiationId, text } = data;

                console.log('🔍 Looking for negotiation:', negotiationId);
                const negotiation = await Negotiation.findById(negotiationId);

                if (!negotiation) {
                    console.error('❌ Negotiation not found:', negotiationId);
                    socket.emit('error', { message: 'Negotiation not found' });
                    return;
                }

                console.log('✅ Negotiation found:', negotiation._id);
                console.log('📝 Current messages count:', negotiation.messages?.length || 0);

                // Add message to negotiation
                const message = {
                    sender: socket.userId,
                    originalText: text,
                    originalLanguage: 'en', // Default to English, can be dynamic later
                    translations: new Map(),
                    timestamp: new Date()
                };

                console.log('💾 Pushing message to array...');
                negotiation.messages.push(message);

                console.log('💾 Saving to database...');
                await negotiation.save();
                console.log('✅ Message saved to DB');

                // Broadcast to all in room
                io.to(`negotiation:${negotiationId}`).emit('new-message', {
                    negotiationId,
                    message: {
                        ...message,
                        sender: socket.userId,
                        senderName: socket.user.name
                    }
                });

                console.log(`✅ Message broadcast in negotiation ${negotiationId}: ${text}`);
            } catch (error) {
                console.error('❌ Error sending message:', error);
                console.error('❌ Error stack:', error.stack);
                console.error('❌ Error details:', {
                    name: error.name,
                    message: error.message,
                    code: error.code
                });
                socket.emit('error', { message: 'Failed to send message', details: error.message });
            }
        });

        // Handle new offer
        socket.on('negotiation-offer', async (data) => {
            try {
                console.log('💰 Backend received offer:', data);
                const { negotiationId, price, quantity, unit } = data;

                const negotiation = await Negotiation.findById(negotiationId)
                    .populate('vendor buyer commodity');

                if (!negotiation) {
                    console.error('❌ Negotiation not found:', negotiationId);
                    return;
                }

                // Determine who is making the offer
                const isVendor = negotiation.vendor._id.toString() === socket.userId;

                // Create offer
                const offer = {
                    price,
                    quantity,
                    unit,
                    proposedBy: isVendor ? 'vendor' : 'buyer',
                    status: 'pending',
                    timestamp: new Date()
                };

                negotiation.currentOffer = offer;

                // Calculate fair trade score
                if (negotiation.commodity.aiSuggestedPrice) {
                    const aiMin = negotiation.commodity.aiSuggestedPrice.min;
                    const aiMax = negotiation.commodity.aiSuggestedPrice.max;
                    const aiMid = (aiMin + aiMax) / 2;

                    const deviation = Math.abs(price - aiMid) / aiMid;
                    negotiation.fairTradeScore = Math.max(0, Math.min(100, 100 - (deviation * 100)));
                }

                await negotiation.save();
                console.log('✅ Offer saved to DB');

                // Broadcast offer
                io.to(`negotiation:${negotiationId}`).emit('new-offer', {
                    negotiationId,
                    offer: {
                        ...offer,
                        proposedBy: isVendor ? 'vendor' : 'buyer',
                        proposerName: socket.user.name
                    },
                    fairTradeScore: negotiation.fairTradeScore
                });

                console.log(`✅ Offer broadcast in negotiation ${negotiationId}: ₹${price}`);
            } catch (error) {
                console.error('❌ Error sending offer:', error);
                socket.emit('error', { message: 'Failed to send offer' });
            }
        });

        // Handle offer acceptance
        socket.on('accept-offer', async (data) => {
            try {
                const { negotiationId } = data;

                const negotiation = await Negotiation.findById(negotiationId)
                    .populate('vendor buyer commodity');

                if (!negotiation || !negotiation.currentOffer) {
                    socket.emit('error', { message: 'Negotiation or offer not found' });
                    return;
                }

                // Validate that user can accept this offer
                const isVendor = socket.userId.toString() === negotiation.vendor._id.toString();
                const proposedBy = negotiation.currentOffer.proposedBy;

                // Only receiving party can accept:
                // - If offer is from vendor, only buyer can accept
                // - If offer is from buyer, only vendor can accept
                const canAccept = (proposedBy === 'vendor' && !isVendor) ||
                    (proposedBy === 'buyer' && isVendor);

                if (!canAccept) {
                    socket.emit('error', {
                        message: 'You cannot accept your own offer. Wait for the other party to respond.'
                    });
                    console.log(`❌ User ${socket.user.name} attempted to accept their own offer`);
                    return;
                }

                // Update offer status
                negotiation.currentOffer.status = 'accepted';
                negotiation.status = 'accepted';
                await negotiation.save();

                // Broadcast acceptance
                io.to(`negotiation:${negotiationId}`).emit('offer-accepted', {
                    negotiationId,
                    offer: negotiation.currentOffer,
                    acceptedBy: socket.user.name
                });

                // Update negotiation status
                io.to(`negotiation:${negotiationId}`).emit('negotiation-status', {
                    negotiationId,
                    status: 'accepted'
                });

                console.log(`Offer accepted in negotiation ${negotiationId}`);
            } catch (error) {
                console.error('Error accepting offer:', error);
                socket.emit('error', { message: 'Failed to accept offer' });
            }
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.name}`);

            // Broadcast user offline status
            socket.broadcast.emit('user-offline', {
                userId: socket.userId,
                name: socket.user.name
            });
        });
    });

    console.log('✅ Socket.io initialized');
    return io;
};

// Get Socket.io instance
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export { initializeSocket, getIO };
