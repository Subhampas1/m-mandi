const Button = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    type = 'button',
    className = '',
    fullWidth = false
}) => {
    const baseClasses = 'font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-saffron-600 hover:bg-saffron-700 text-white hover:shadow-xl',
        secondary: 'bg-white hover:bg-gray-50 text-saffron-700 border-2 border-saffron-600',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'bg-transparent hover:bg-saffron-50 text-saffron-700'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
