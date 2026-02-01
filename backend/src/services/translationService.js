import axios from 'axios';

/**
 * Translation Service
 * Uses LibreTranslate API with fallback support
 */
class TranslationService {
    constructor() {
        this.baseURL = 'https://libretranslate.com/translate';

        // Language code mappings
        this.languageCodes = {
            'hindi': 'hi',
            'bengali': 'bn',
            'tamil': 'ta',
            'telugu': 'te',
            'marathi': 'mr',
            'gujarati': 'gu',
            'kannada': 'kn',
            'malayalam': 'ml',
            'punjabi': 'pa',
            'english': 'en'
        };

        // Common commodity translations (fallback cache)
        this.staticTranslations = {
            // Vegetables
            'Tomatoes': { hi: 'टमाटर', bn: 'টমেটো', ta: 'தக்காளி' },
            'Onions': { hi: 'प्याज', bn: 'পেঁয়াজ', ta: 'வெங்காயம்' },
            'Potatoes': { hi: 'आलू', bn: 'আলু', ta: 'உருளைக்கிழங்கு' },
            'Carrots': { hi: 'गाजर', bn: 'গাজর', ta: 'கேரட்' },

            // Fruits
            'Apples': { hi: 'सेब', bn: 'আপেল', ta: 'ஆப்பிள்' },
            'Mangoes': { hi: 'आम', bn: 'আম', ta: 'மாம்பழம்' },
            'Bananas': { hi: 'केले', bn: 'কলা', ta: 'வாழைப்பழம்' },

            // Grains
            'Rice': { hi: 'चावल', bn: 'চাল', ta: 'அரிசி' },
            'Wheat': { hi: 'गेहूं', bn: 'গম', ta: 'கோதுமை' }
        };
    }

    /**
     * Translate text from source to target language
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @param {string} sourceLang - Source language code (default: 'en')
     * @returns {Promise<string>} Translated text
     */
    async translate(text, targetLang, sourceLang = 'en') {
        // Check static cache first
        if (this.staticTranslations[text] && this.staticTranslations[text][targetLang]) {
            return this.staticTranslations[text][targetLang];
        }

        // Convert language names to codes
        const sourceCode = this.languageCodes[sourceLang.toLowerCase()] || sourceLang;
        const targetCode = this.languageCodes[targetLang.toLowerCase()] || targetLang;

        // If same language, return original
        if (sourceCode === targetCode) {
            return text;
        }

        try {
            const response = await axios.post(this.baseURL, {
                q: text,
                source: sourceCode,
                target: targetCode,
                format: 'text'
            }, {
                timeout: 5000
            });

            return response.data.translatedText || text;
        } catch (error) {
            console.error('Translation Error:', error.message);

            // Return original text if translation fails
            return text;
        }
    }

    /**
     * Translate multiple texts at once
     * @param {Array<string>} texts - Array of texts to translate
     * @param {string} targetLang - Target language
     * @param {string} sourceLang - Source language
     * @returns {Promise<Array<string>>} Array of translated texts
     */
    async translateBatch(texts, targetLang, sourceLang = 'en') {
        const promises = texts.map(text => this.translate(text, targetLang, sourceLang));
        return Promise.all(promises);
    }

    /**
     * Get language code from language name
     * @param {string} language - Language name
     * @returns {string} Language code
     */
    getLanguageCode(language) {
        return this.languageCodes[language.toLowerCase()] || 'en';
    }

    /**
     * Add a static translation to cache
     * @param {string} text - Original text
     * @param {string} lang - Language code
     * @param {string} translation - Translated text
     */
    cacheTranslation(text, lang, translation) {
        if (!this.staticTranslations[text]) {
            this.staticTranslations[text] = {};
        }
        this.staticTranslations[text][lang] = translation;
    }
}

export default new TranslationService();
