const Alert = ({ type = 'info', message, onClose, className = '' }) => {
    const types = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    };

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={`border px-4 py-3 rounded relative ${types[type]} ${className}`} role="alert">
            <div className="flex items-start">
                <span className="text-xl mr-3">{icons[type]}</span>
                <span className="flex-1">{message}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-3 font-bold hover:opacity-70"
                        aria-label="Close alert"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;
