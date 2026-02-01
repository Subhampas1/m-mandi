import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

const LanguageSelect = () => {
    const navigate = useNavigate();
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const { isListening, startListening, isSupported } = useVoiceRecognition(currentLanguage);
    const [selected, setSelected] = useState(currentLanguage);

    const handleLanguageSelect = (langCode) => {
        setSelected(langCode);
        changeLanguage(langCode);
        // Auto-navigate after selection
        setTimeout(() => {
            navigate('/role-select');
        }, 500);
    };

    const handleVoiceInput = () => {
        if (isSupported) {
            startListening();
        } else {
            alert('Voice recognition is not supported in your browser. Please select manually.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mandi-cream to-saffron-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-saffron-700 hover:text-saffron-800 mb-4 flex items-center gap-2 mx-auto"
                    >
                        <span>←</span> Back
                    </button>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Language</h2>
                    <p className="text-xl text-gray-700">बोलिए अपनी भाषा में</p>
                </div>

                {/* Voice Input */}
                <div className="text-center mb-10">
                    <button
                        onClick={handleVoiceInput}
                        className={`voice-button mx-auto ${isListening ? 'pulse bg-red-500' : ''}`}
                        aria-label="Voice input"
                    >
                        <span className="text-4xl">🎤</span>
                    </button>
                    <p className="mt-4 text-gray-600">
                        {isListening ? 'Listening...' : 'Tap to speak or select below'}
                    </p>
                    {!isSupported && (
                        <p className="text-sm text-orange-600 mt-2">
                            Voice not supported in this browser
                        </p>
                    )}
                </div>

                {/* Language Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`card text-center transition-all duration-200 ${selected === lang.code
                                    ? 'border-4 border-saffron-600 bg-saffron-50'
                                    : 'hover:border-2 hover:border-saffron-300'
                                }`}
                        >
                            <div className="text-4xl mb-2">{lang.flag}</div>
                            <div className="text-2xl font-semibold mb-1">{lang.nativeName}</div>
                            <div className="text-sm text-gray-600">{lang.name}</div>
                        </button>
                    ))}
                </div>

                {/* Selected Language Indicator */}
                {selected && (
                    <div className="text-center text-lg text-gray-700">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-100 rounded-full">
                            <span>🗣️</span>
                            <span>Selected: {languages.find(l => l.code === selected)?.nativeName}</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSelect;
