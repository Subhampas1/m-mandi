import axios from 'axios';

// Language codes mapping
export const LANGUAGE_CODES = {
    hindi: 'hi',
    english: 'en',
    tamil: 'ta',
    bengali: 'bn',
    marathi: 'mr',
    telugu: 'te',
    gujarati: 'gu',
    kannada: 'kn',
    malayalam: 'ml',
    punjabi: 'pa'
};

// Free translation service using LibreTranslate (or Google Translate if API key provided)
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
    try {
        // If Google Translate API key is provided, use it
        if (process.env.GOOGLE_TRANSLATE_KEY) {
            const response = await axios.post(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_KEY}`,
                {
                    q: text,
                    target: LANGUAGE_CODES[targetLang] || targetLang,
                    source: sourceLang === 'auto' ? undefined : (LANGUAGE_CODES[sourceLang] || sourceLang)
                }
            );
            return {
                translatedText: response.data.data.translations[0].translatedText,
                sourceLang: response.data.data.translations[0].detectedSourceLanguage || sourceLang,
                targetLang
            };
        }

        // Fallback: Use free LibreTranslate API
        const response = await axios.post('https://libretranslate.de/translate', {
            q: text,
            source: sourceLang === 'auto' ? 'auto' : (LANGUAGE_CODES[sourceLang] || sourceLang),
            target: LANGUAGE_CODES[targetLang] || targetLang,
            format: 'text'
        });

        return {
            translatedText: response.data.translatedText,
            sourceLang: response.data.detectedLanguage?.language || sourceLang,
            targetLang
        };
    } catch (error) {
        console.error('Translation error:', error.message);
        // Return original text if translation fails
        return {
            translatedText: text,
            sourceLang: sourceLang,
            targetLang: targetLang,
            error: 'Translation failed, returning original text'
        };
    }
};

// Translate to multiple languages at once
export const translateToMultiple = async (text, targetLanguages, sourceLang = 'auto') => {
    const translations = {};

    for (const lang of targetLanguages) {
        const result = await translateText(text, lang, sourceLang);
        translations[lang] = result.translatedText;
    }

    return translations;
};

export default { translateText, translateToMultiple, LANGUAGE_CODES };
