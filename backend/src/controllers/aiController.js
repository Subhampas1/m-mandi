import { getGeminiModel, getPriceDiscoveryPrompt, getNegotiationPrompt } from '../config/ai.js';
import { translateText } from '../config/translate.js';

// @desc    Get AI price suggestion
// @route   POST /api/ai/price-discovery
// @access  Private
export const getPriceSuggestion = async (req, res) => {
    try {
        const { commodityName, quantity, unit, location, quality } = req.body;

        if (!commodityName || !quantity || !location) {
            return res.status(400).json({
                success: false,
                message: 'Please provide commodity name, quantity, and location'
            });
        }

        const model = getGeminiModel();
        const prompt = getPriceDiscoveryPrompt({
            name: commodityName,
            quantity,
            unit: unit || 'kg',
            location,
            quality: quality || 'Standard',
            date: new Date().toLocaleDateString('en-IN')
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        let priceData;
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            priceData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('AI Response:', text);

            // Fallback response if parsing fails
            priceData = {
                suggestedPrice: { min: 40, max: 60 },
                confidence: 70,
                factors: [
                    {
                        type: 'regional_average',
                        description: 'Based on typical market prices in the region',
                        impact: 'high'
                    }
                ],
                reasoning: 'Price suggestion based on regional market analysis'
            };
        }

        res.json({
            success: true,
            data: priceData
        });
    } catch (error) {
        console.error('AI Price Discovery Error:', error);

        // Provide fallback pricing instead of failing
        console.log('📊 Using fallback pricing logic...');

        const { commodityName, quantity, unit, quality } = req.body;

        // Simple fallback pricing based on commodity type and quality
        const basePrices = {
            'tomato': 45,
            'onion': 30,
            'potato': 25,
            'mango': 200,
            'rice': 80,
            'wheat': 35,
            'dal': 120,
            'spice': 250
        };

        // Try to match commodity name with base prices
        let basePrice = 50; // Default
        for (const [key, price] of Object.entries(basePrices)) {
            if (commodityName.toLowerCase().includes(key)) {
                basePrice = price;
                break;
            }
        }

        // Adjust for quality
        const qualityMultiplier = {
            'premium': 1.3,
            'a-grade': 1.15,
            'standard': 1.0,
            'b-grade': 0.85
        };

        const multiplier = qualityMultiplier[quality?.toLowerCase()] || 1.0;
        const adjustedPrice = basePrice * multiplier;

        const fallbackData = {
            suggestedPrice: {
                min: Math.round(adjustedPrice * 0.85),
                max: Math.round(adjustedPrice * 1.15)
            },
            confidence: 65,
            factors: [
                {
                    type: 'market_average',
                    description: 'Based on typical market prices',
                    impact: 'high'
                },
                {
                    type: 'quality_grade',
                    description: `${quality || 'Standard'} quality adjustment`,
                    impact: 'medium'
                }
            ],
            reasoning: 'Price suggestion based on market averages and quality grade. For more accurate pricing, configure GEMINI_API_KEY.',
            usingFallback: true
        };

        res.json({
            success: true,
            data: fallbackData,
            warning: 'Using fallback pricing. Configure GEMINI_API_KEY for AI-powered suggestions.'
        });
    }
};

// @desc    Translate text
// @route   POST /api/ai/translate
// @access  Public
export const translate = async (req, res) => {
    try {
        const { text, targetLang, sourceLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({
                success: false,
                message: 'Please provide text and target language'
            });
        }

        const result = await translateText(text, targetLang, sourceLang || 'auto');

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Translation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Translation failed',
            error: error.message
        });
    }
};

// @desc    Get AI negotiation assistance
// @route   POST /api/ai/negotiation-assist
// @access  Private
export const getNegotiationAssist = async (req, res) => {
    try {
        const { commodityName, vendorPrice, buyerOffer, aiPrice, language, conversationHistory } = req.body;

        if (!commodityName || !vendorPrice || !buyerOffer || !aiPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const model = getGeminiModel();
        const prompt = getNegotiationPrompt({
            commodityName,
            vendorPrice,
            buyerOffer,
            aiPrice,
            language: language || 'english',
            conversationHistory
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        let suggestionsData;
        try {
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            suggestionsData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // Fallback suggestions
            const midPrice = (vendorPrice + buyerOffer) / 2;
            suggestionsData = {
                suggestions: [
                    {
                        text: `How about ₹${Math.round(midPrice)}?`,
                        pricePoint: Math.round(midPrice),
                        reasoning: 'A fair middle ground between both offers'
                    }
                ]
            };
        }

        res.json({
            success: true,
            data: suggestionsData
        });
    } catch (error) {
        console.error('AI Negotiation Assist Error:', error);
        console.log('📊 Using fallback negotiation assistance...');

        const { vendorPrice, buyerOffer, aiPrice } = req.body;

        // Provide smart fallback suggestions
        const midPrice = Math.round((vendorPrice + buyerOffer) / 2);
        const aiMidPrice = aiPrice ? Math.round((aiPrice.min + aiPrice.max) / 2) : midPrice;

        const suggestions = [
            {
                text: `How about meeting halfway at ₹${midPrice}?`,
                pricePoint: midPrice,
                reasoning: 'A fair compromise between both offers'
            }
        ];

        // Add AI-based suggestion if available
        if (aiPrice && aiMidPrice !== midPrice) {
            suggestions.push({
                text: `Based on market rates, ₹${aiMidPrice} seems fair`,
                pricePoint: aiMidPrice,
                reasoning: 'Aligned with current market prices'
            });
        }

        // Add slightly higher/lower alternatives
        if (req.user.role === 'vendor' || req.user.role === 'both') {
            const vendorSuggestion = Math.round(midPrice * 1.05);
            suggestions.push({
                text: `I could do ₹${vendorSuggestion}`,
                pricePoint: vendorSuggestion,
                reasoning: 'Slightly above midpoint, still reasonable'
            });
        } else {
            const buyerSuggestion = Math.round(midPrice * 0.95);
            suggestions.push({
                text: `Would you accept ₹${buyerSuggestion}?`,
                pricePoint: buyerSuggestion,
                reasoning: 'A competitive offer below midpoint'
            });
        }

        res.json({
            success: true,
            data: { suggestions },
            warning: 'Using fallback suggestions. Configure GEMINI_API_KEY for AI-powered assistance.'
        });
    }
};
