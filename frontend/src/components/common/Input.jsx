const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    error = null,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold mb-2" htmlFor={name}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-200 transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-saffron-500'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;
