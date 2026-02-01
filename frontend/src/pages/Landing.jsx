import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

const Landing = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const { isListening, startListening, isSupported, transcript, resetTranscript } = useVoiceRecognition(currentLanguage);
    const [selected, setSelected] = useState(currentLanguage);
    const [feedback, setFeedback] = useState('');

    // Handle voice commands
    useEffect(() => {
        if (transcript) {
            console.log('🗣️ Heard:', transcript);
            const spokenText = transcript.toLowerCase();
            setFeedback(`Heard: "${transcript}"`);

            // Try to find a matching language (check name, nativeName, code, or aliases)
            const matchedLang = languages.find(lang =>
                spokenText.includes(lang.name.toLowerCase()) ||
                spokenText.includes(lang.nativeName.toLowerCase()) ||
                spokenText.includes(lang.code.toLowerCase()) ||
                (lang.aliases && lang.aliases.some(alias => spokenText.includes(alias.toLowerCase())))
            );

            if (matchedLang) {
                console.log('✅ Voice matched language:', matchedLang.name);
                setFeedback(`✅ Switching to ${matchedLang.name}...`);

                // Small delay to let user read the feedback before switching
                setTimeout(() => {
                    handleLanguageSelect(matchedLang.code);
                    resetTranscript();
                    setFeedback('');
                }, 1500);
            } else {
                // Clear feedback after 3s if no match found
                setTimeout(() => setFeedback(''), 3000);
            }
        }
    }, [transcript, languages]);

    const handleLanguageSelect = (langCode) => {
        setSelected(langCode);
        changeLanguage(langCode);
        // Language changes dynamically without navigation
    };

    const handleContinue = () => {
        if (isAuthenticated) {
            // Navigate to user's dashboard based on role
            if (user.role === 'vendor') {
                navigate('/vendor');
            } else if (user.role === 'buyer') {
                navigate('/marketplace');
            } else {
                navigate('/marketplace'); // Default to marketplace
            }
        } else {
            navigate('/role-select');
        }
    };

    const handleVoiceInput = () => {
        if (isSupported) {
            setFeedback('Listening...');
            startListening();
        } else {
            alert('Voice recognition is not supported in your browser. Please select manually.');
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-mandi-cream via-white to-saffron-50">
            {/* Header */}
            <header className="py-6 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🛒</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            The Multilingual Mandi
                        </h1>
                    </div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="px-6 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 font-semibold"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2 text-saffron-700 hover:text-saffron-800 font-semibold"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content - Language Selection */}
            <section className="max-w-4xl mx-auto px-4 py-6 md:py-10">
                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Choose Your Language
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700">
                        बोलिए अपनी भाषा में
                    </p>
                </div>

                {/* Voice Input */}
                {/* Voice Input */}
                {/* Voice Input */}
                <div className="text-center mb-6">
                    <button
                        onClick={handleVoiceInput}
                        className={`voice-button mx-auto ${isListening ? 'pulse bg-red-500' : ''}`}
                        aria-label="Voice input"
                        style={{ width: '60px', height: '60px' }}
                    >
                        <span className="text-3xl">🎤</span>
                    </button>
                    <div className="h-8 mt-2 transition-all duration-300">
                        {feedback ? (
                            <p className="text-saffron-700 font-medium animate-fade-in">
                                {feedback}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                {isListening ? 'Listening...' : 'Tap to speak (e.g., "Hindi", "Tamil")'}
                            </p>
                        )}
                    </div>
                    {!isSupported && (
                        <p className="text-xs text-orange-600 mt-1">
                            Voice not supported in this browser
                        </p>
                    )}
                </div>

                {/* Language Grid */}
                <div className="grid grid-cols-6 gap-3 mb-4 max-w-4xl mx-auto">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`flex items-center justify-center p-3 rounded-full aspect-square transition-all duration-200 ${selected === lang.code
                                ? 'bg-saffron-600 text-white scale-105 shadow-lg'
                                : 'bg-white hover:bg-saffron-50 hover:scale-105 shadow-md hover:shadow-lg'
                                }`}
                            title={lang.name}
                        >
                            <div className={`text-xs font-semibold text-center leading-tight ${selected === lang.code ? 'text-white' : 'text-gray-800'
                                }`}>
                                {lang.nativeName}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Language Indicator */}
                {selected && (
                    <div className="text-center space-y-3">
                        <div className="text-sm text-gray-700">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-100 rounded-full">
                                <span>🗣️</span>
                                <span>Selected: {languages.find(l => l.code === selected)?.nativeName}</span>
                            </span>
                        </div>
                        <button
                            onClick={handleContinue}
                            className="px-6 py-2 bg-saffron-600 text-white rounded-full font-semibold text-base hover:bg-saffron-700 transform hover:scale-105 transition-all shadow-md"
                        >
                            {isAuthenticated ? '→ Continue to Dashboard' : '→ Continue'}
                        </button>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-600">
                <p>Built with Love ❤️ by Team Nexus</p>
                <p className="text-sm mt-2">Visualizing a Viksit Bharat through Generative AI</p>
            </footer>
        </div>
    );
};

export default Landing;
