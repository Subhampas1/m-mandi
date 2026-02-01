const MessageBubble = ({ message, isOwn = false, timestamp }) => {
    const bubbleClass = isOwn
        ? 'bg-saffron-500 text-white ml-auto'
        : 'bg-gray-200 text-gray-900';

    // Get the text to display - prioritize originalText, fallback to text for backwards compatibility
    const displayText = message.originalText || message.text;

    return (
        <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 ${bubbleClass}`}>
                {message.translatedText && message.translatedText !== displayText && (
                    <div className="text-sm opacity-80 mb-1 italic">
                        {message.translatedText}
                    </div>
                )}
                <div className="text-base">{displayText}</div>
            </div>
            {timestamp && (
                <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
