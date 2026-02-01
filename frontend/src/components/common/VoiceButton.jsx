import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

const VoiceButton = ({
    onTranscript,
    language = 'hindi',
    disabled = false,
    className = ''
}) => {
    const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition(language);

    const handleClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Send transcript to parent when it updates
    React.useEffect(() => {
        if (transcript && onTranscript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    if (!isSupported) {
        return null; // Don't show button if not supported
    }

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all duration-200 ${isListening
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-saffron-500 hover:bg-saffron-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
            <span className="text-4xl">🎤</span>
        </button>
    );
};

export default VoiceButton;
