const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-200 transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-saffron-500'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Select;
