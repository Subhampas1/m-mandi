const Card = ({ children, className = '', onClick, hoverable = false }) => {
    const hoverClass = hoverable ? 'hover:shadow-xl cursor-pointer' : '';

    return (
        <div
            className={`bg-white rounded-2xl shadow-md p-6 transition-all duration-200 ${hoverClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
