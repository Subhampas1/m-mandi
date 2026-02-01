/**
 * Email Service
 * Handles email notifications (can be extended with SendGrid, Nodemailer, etc.)
 */
class EmailService {
    constructor() {
        this.enabled = process.env.EMAIL_ENABLED === 'true';
        this.from = process.env.EMAIL_FROM || 'noreply@multilingualmandi.com';
    }

    /**
     * Send welcome email to new user
     * @param {Object} user - User object
     */
    async sendWelcomeEmail(user) {
        if (!this.enabled) {
            console.log('Email disabled. Would send welcome email to:', user.email);
            return;
        }

        const subject = 'Welcome to The Multilingual Mandi!';
        const html = `
            <h1>Welcome ${user.name}!</h1>
            <p>Thank you for joining The Multilingual Mandi - India's Digital Agriculture Marketplace.</p>
            <p>Your account has been successfully created as a <strong>${user.role}</strong>.</p>
            <p>You can now:</p>
            <ul>
                ${user.role === 'vendor' || user.role === 'both' ? '<li>List your agricultural commodities</li>' : ''}
                ${user.role === 'vendor' || user.role === 'both' ? '<li>Get AI-powered price suggestions</li>' : ''}
                ${user.role === 'buyer' || user.role === 'both' ? '<li>Browse fresh produce from verified vendors</li>' : ''}
                ${user.role === 'buyer' || user.role === 'both' ? '<li>Negotiate fair prices in real-time</li>' : ''}
                <li>Use voice commands in your preferred language</li>
            </ul>
            <p>Happy Trading!</p>
        `;

        return this.send(user.email, subject, html);
    }

    /**
     * Send negotiation started notification
     * @param {Object} params - Negotiation details
     */
    async sendNegotiationNotification(params) {
        if (!this.enabled) {
            console.log('Email disabled. Would send negotiation notification');
            return;
        }

        const { recipient, commodity, initiator } = params;

        const subject = `New Negotiation: ${commodity.name}`;
        const html = `
            <h2>New Negotiation Started</h2>
            <p>${initiator.name} has started a negotiation for your commodity:</p>
            <h3>${commodity.name}</h3>
            <p><strong>Quantity:</strong> ${commodity.quantity} ${commodity.unit}</p>
            <p><strong>Your Listed Price:</strong> ₹${commodity.price}/${commodity.unit}</p>
            <p>Login to your account to respond and negotiate in real-time!</p>
        `;

        return this.send(recipient.email, subject, html);
    }

    /**
     * Send offer received notification
     * @param {Object} params - Offer details
     */
    async sendOfferNotification(params) {
        if (!this.enabled) {
            console.log('Email disabled. Would send offer notification');
            return;
        }

        const { recipient, offer, commodity } = params;

        const subject = `New Offer: ₹${offer.price}/${commodity.unit}`;
        const html = `
            <h2>New Offer Received</h2>
            <p>You have received a new offer for <strong>${commodity.name}</strong>:</p>
            <p><strong>Offered Price:</strong> ₹${offer.price}/${commodity.unit}</p>
            <p><strong>Quantity:</strong> ${offer.quantity} ${commodity.unit}</p>
            ${offer.aiSuggestion ? `<p><strong>AI Suggestion:</strong> ${offer.aiSuggestion.text}</p>` : ''}
            <p>Login to accept or make a counter-offer!</p>
        `;

        return this.send(recipient.email, subject, html);
    }

    /**
     * Send deal completed notification
     * @param {Object} params - Deal details
     */
    async sendDealCompletedNotification(params) {
        if (!this.enabled) {
            console.log('Email disabled. Would send deal completed notification');
            return;
        }

        const { recipient, negotiation, finalPrice } = params;

        const subject = 'Deal Completed! 🎉';
        const html = `
            <h2>Congratulations! Your Deal is Complete</h2>
            <p>The negotiation for <strong>${negotiation.commodity.name}</strong> has been successfully completed!</p>
            <p><strong>Final Price:</strong> ₹${finalPrice}/${negotiation.commodity.unit}</p>
            <p><strong>Quantity:</strong> ${negotiation.commodity.quantity} ${negotiation.commodity.unit}</p>
            <p><strong>Total Amount:</strong> ₹${finalPrice * negotiation.commodity.quantity}</p>
            <p>Please coordinate with the other party for delivery and payment details.</p>
        `;

        return this.send(recipient.email, subject, html);
    }

    /**
     * Generic send method (to be implemented with actual email provider)
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     */
    async send(to, subject, html) {
        // TODO: Implement with actual email service (SendGrid, Nodemailer, etc.)
        console.log(`
[EMAIL] Would send email:
To: ${to}
Subject: ${subject}
Content: ${html.substring(0, 100)}...
        `);

        // Placeholder for actual implementation:
        /*
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        return await transporter.sendMail({
            from: this.from,
            to,
            subject,
            html
        });
        */

        return Promise.resolve({ sent: true });
    }
}

export default new EmailService();
