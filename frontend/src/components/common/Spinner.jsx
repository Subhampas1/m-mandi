const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4'
    };

    return (
        <div
            className={`inline-block border-white border-t-transparent rounded-full animate-spin ${sizes[size]} ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
                <Spinner size="lg" className="border-saffron-600 border-t-transparent" />
                <p className="text-gray-700 font-semibold">{message}</p>
            </div>
        </div>
    );
};

export default Spinner;
