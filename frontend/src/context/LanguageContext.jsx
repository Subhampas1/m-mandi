import { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES } from '../utils/constants';
import { translate } from '../utils/translations';

const LanguageContext = createContext(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        // Get from localStorage or default to English
        const saved = localStorage.getItem('preferredLanguage');
        return saved || 'english';
    });

    const changeLanguage = (langCode) => {
        setCurrentLanguage(langCode);
        localStorage.setItem('preferredLanguage', langCode);
    };

    const getLanguageName = (code) => {
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.nativeName : code;
    };

    // Translation function
    const t = (key) => {
        return translate(key, currentLanguage);
    };

    const value = {
        currentLanguage,
        changeLanguage,
        getLanguageName,
        languages: LANGUAGES,
        t // Add translation function
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
