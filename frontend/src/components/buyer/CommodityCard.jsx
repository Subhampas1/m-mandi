import Card from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { translateCommodity } from '../../utils/translations';

const CommodityCard = ({ commodity, onNegotiate, showVendor = true }) => {
    const { currentLanguage } = useLanguage();

    const {
        name,
        category,
        quality,
        quantity,
        unit,
        price,
        location,
        aiSuggestedPrice,
        vendor
    } = commodity;

    // Translate the commodity name
    const translatedName = translateCommodity(name, currentLanguage);

    return (
        <Card hoverable>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold">{translatedName}</h3>
                    <p className="text-sm text-gray-600 capitalize">{category}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {quality}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">
                        {quantity} {unit}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-lg font-bold text-saffron-600">
                        ₹{price}/{unit}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-sm">{location}</span>
                </div>
                {showVendor && vendor && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Vendor:</span>
                        <span className="text-sm font-semibold">{vendor.name}</span>
                    </div>
                )}
            </div>

            {aiSuggestedPrice && (
                <div className="mb-4 p-2 bg-saffron-50 rounded text-xs">
                    <span className="text-saffron-700">✨ AI Fair Price: </span>
                    <span className="font-semibold">
                        ₹{aiSuggestedPrice.min}-₹{aiSuggestedPrice.max}
                    </span>
                </div>
            )}

            {onNegotiate && (
                <button
                    onClick={() => onNegotiate(commodity)}
                    className="btn-primary w-full text-sm"
                >
                    🤝 Start Negotiation
                </button>
            )}
        </Card>
    );
};

export default CommodityCard;
