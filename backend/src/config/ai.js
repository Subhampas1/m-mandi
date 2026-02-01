import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini Pro model
export const getGeminiModel = () => {
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

// Price discovery prompt template
export const getPriceDiscoveryPrompt = ({ name, quantity, unit, location, quality, date }) => {
    return `You are an expert agricultural commodity price analyst for India.

Commodity: ${name}
Quantity: ${quantity} ${unit}
Location: ${location}
Quality: ${quality}
Current Date: ${date || new Date().toLocaleDateString('en-IN')}

Task: Analyze fair market price considering:
1. Regional average prices in India
2. Seasonal demand patterns
3. Quality grade impact on pricing
4. Current market trends
5. Supply-demand dynamics

Important: Return ONLY valid JSON, no markdown formatting, no code blocks.

Return JSON format:
{
  "suggestedPrice": {
    "min": <number>,
    "max": <number>
  },
  "confidence": <number between 0-100>,
  "factors": [
    {
      "type": "regional_average",
      "description": "<brief explanation>",
      "impact": "high"
    },
    {
      "type": "seasonal",
      "description": "<brief explanation>",
      "impact": "medium"
    },
    {
      "type": "quality",
      "description": "<brief explanation>",
      "impact": "medium"
    },
    {
      "type": "trend",
      "description": "<brief explanation>",
      "impact": "low"
    }
  ],
  "reasoning": "<2-3 sentence summary>"
}`;
};

// Negotiation assistant prompt template
export const getNegotiationPrompt = ({ commodityName, vendorPrice, buyerOffer, aiPrice, language, conversationHistory }) => {
    return `You are a respectful negotiation assistant for Indian marketplace.

Context:
- Commodity: ${commodityName}
- Vendor asking: ₹${vendorPrice}
- Buyer offering: ₹${buyerOffer}
- AI fair price range: ₹${aiPrice.min} - ₹${aiPrice.max}
- User's language: ${language}
${conversationHistory ? `- Conversation so far: ${conversationHistory}` : ''}

Task: Generate 2-3 polite counter-offer suggestions that:
1. Move toward the fair price range
2. Are culturally appropriate for Indian context
3. Use respectful business language
4. Consider both parties' interests
5. Maintain harmony while being fair

Important: Return ONLY valid JSON, no markdown formatting, no code blocks.

Return JSON format:
{
  "suggestions": [
    {
      "text": "<suggestion in ${language}>",
      "pricePoint": <number>,
      "reasoning": "<why this is fair>"
    }
  ]
}`;
};

export default genAI;
