import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AI Service for price discovery and negotiation assistance
 */
class AIService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Get AI-powered price discovery for a commodity
     * @param {Object} commodityData - Commodity information
     * @returns {Promise<Object>} Price suggestion with factors
     */
    async getPriceDiscovery(commodityData) {
        const { commodityName, quantity, unit, quality, location } = commodityData;

        const prompt = `As an agricultural market expert in India, analyze the fair market price for the following commodity:

Commodity: ${commodityName}
Quantity: ${quantity} ${unit}
Quality Grade: ${quality}
Location: ${location}

Provide a price analysis in JSON format with:
1. suggestedPrice: {min: number, max: number} (in INR per ${unit})
2. confidence: percentage (0-100)
3. factors: array of {type, description, impact} affecting the price
4. reasoning: brief explanation

Consider:
- Current market trends in India
- Seasonal variations
- Quality grade impact
- Regional pricing differences
- Supply-demand dynamics

Respond ONLY with valid JSON.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid AI response format');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('AI Price Discovery Error:', error);

            // Fallback to basic pricing
            return this.getFallbackPricing(commodityData);
        }
    }

    /**
     * Get AI assistance for negotiation
     * @param {Object} negotiationContext - Current negotiation state
     * @returns {Promise<Object>} AI suggestion
     */
    async getNegotiationAssistance(negotiationContext) {
        const { commodity, currentOffer, marketPrice, messages } = negotiationContext;

        const prompt = `As a fair trade negotiation assistant for Indian agriculture, analyze this negotiation:

Commodity: ${commodity.name}
Current Offer: ₹${currentOffer} per ${commodity.unit}
Market Price Range: ₹${marketPrice.min}-₹${marketPrice.max}
Recent Messages: ${messages.slice(-3).map(m => m.text).join(', ')}

Provide negotiation advice in JSON format:
{
    "suggestion": "brief suggestion for the user",
    "fairPrice": number,
    "reasoning": "why this is fair",
    "nextStep": "recommended action"
}

Focus on fair trade and mutual benefit. Respond ONLY with valid JSON.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid AI response format');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('AI Negotiation Assistance Error:', error);
            return {
                suggestion: 'Consider the market price range when making your offer',
                fairPrice: (marketPrice.min + marketPrice.max) / 2,
                reasoning: 'This is the midpoint of the current market range',
                nextStep: 'Make a counteroffer close to the fair price'
            };
        }
    }

    /**
     * Fallback pricing when AI fails
     * @param {Object} commodityData
     * @returns {Object} Basic pricing
     */
    getFallbackPricing(commodityData) {
        // Basic price ranges for common commodities (INR per kg)
        const basePrices = {
            vegetables: { min: 20, max: 60 },
            fruits: { min: 40, max: 120 },
            grains: { min: 25, max: 50 },
            pulses: { min: 80, max: 150 },
            spices: { min: 200, max: 500 }
        };

        const category = commodityData.category || 'vegetables';
        const basePrice = basePrices[category] || basePrices.vegetables;

        // Adjust for quality
        const qualityMultiplier = {
            'Premium': 1.3,
            'Standard': 1.0,
            'Economy': 0.8
        };

        const multiplier = qualityMultiplier[commodityData.quality] || 1.0;

        return {
            suggestedPrice: {
                min: Math.round(basePrice.min * multiplier),
                max: Math.round(basePrice.max * multiplier)
            },
            confidence: 60,
            factors: [
                {
                    type: 'quality',
                    description: `${commodityData.quality} grade affects pricing`,
                    impact: 'moderate'
                },
                {
                    type: 'category',
                    description: `${category} category base pricing`,
                    impact: 'high'
                }
            ],
            reasoning: 'Estimated based on typical market ranges for this category and quality'
        };
    }

    /**
     * Calculate fair trade score for a negotiation
     * @param {Object} params
     * @returns {number} Score from 0-100
     */
    calculateFairTradeScore(params) {
        const { offeredPrice, suggestedPrice } = params;

        if (!suggestedPrice || !suggestedPrice.min || !suggestedPrice.max) {
            return 50; // Neutral score if no AI price available
        }

        const midPrice = (suggestedPrice.min + suggestedPrice.max) / 2;
        const deviation = Math.abs(offeredPrice - midPrice) / midPrice;

        // Score decreases with deviation from fair price
        const score = Math.max(0, Math.min(100, 100 - (deviation * 100)));

        return Math.round(score);
    }
}

export default new AIService();
