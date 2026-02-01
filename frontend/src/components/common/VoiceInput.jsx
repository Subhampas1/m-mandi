import { useState, useEffect, useRef } from 'react';

const VoiceInput = ({ onTranscript, language = 'en-US', disabled = false, className = '' }) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after one sentence/phrase
            recognitionRef.current.interimResults = true; // Show results while speaking
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const toggleListening = (e) => {
        e.preventDefault(); // Prevent form submission if inside a form
        if (!recognitionRef.current) {
            alert('Voice input is not supported in this browser. Please try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            startListening();
        }
    };

    const startListening = () => {
        setError(null);
        setIsListening(true);

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            // Only send final results or handle interim if needed
            // For now, we update as we go but we might want to only send on final
            if (event.results[0].isFinal) {
                onTranscript(transcript);
                setIsListening(false);
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setIsListening(false);

            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access to use voice input.');
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors, just stop listening
            } else {
                alert(`Voice input error: ${event.error}`);
            }
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        try {
            recognitionRef.current.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
            setIsListening(false);
        }
    };

    if (!recognitionRef.current && !disabled) {
        return null; // Don't render if not supported
    }

    return (
        <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={`flex items-center justify-center transition-all duration-300
                ${isListening
                    ? 'bg-red-100 text-red-600 animate-pulse border-2 border-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || 'p-3 rounded-xl'}`}
            title={isListening ? 'Listening...' : 'Click to speak'}
        >
            {isListening ? (
                // Stop Icon / Listening Wave
                <span className={className ? "text-inherit" : "text-xl"}>🛑</span>
            ) : (
                // Microphone Icon
                <span className={className ? "text-inherit" : "text-xl"}>🎙️</span>
            )}
        </button>
    );
};

export default VoiceInput;
