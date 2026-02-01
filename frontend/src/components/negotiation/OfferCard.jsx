import Card from '../common/Card';
import Button from '../common/Button';

const OfferCard = ({ offer, onAccept, onCounter, isVendor = false }) => {
    const {
        price,
        quantity,
        unit,
        aiSuggestion,
        status,
        proposedBy
    } = offer;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        countered: 'bg-blue-100 text-blue-800'
    };

    return (
        <Card className="border-2 border-saffron-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-semibold text-lg">
                        {proposedBy === 'vendor' ? 'Vendor Offer' : 'Buyer Offer'}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {quantity} {unit}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[status]}`}>
                    {status}
                </span>
            </div>

            <div className="mb-4">
                <div className="text-3xl font-bold text-saffron-600 mb-1">
                    ₹{price}
                    <span className="text-lg text-gray-600">/{unit}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Total: ₹{(price * quantity).toLocaleString()}
                </div>
            </div>

            {aiSuggestion && (
                <div className="bg-saffron-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                        <span className="text-lg">✨</span>
                        <div className="flex-1">
                            <div className="text-xs font-semibold text-saffron-700 mb-1">AI Suggestion</div>
                            <p className="text-sm text-gray-700">{aiSuggestion.text}</p>
                            {aiSuggestion.pricePoint && (
                                <div className="text-xs text-gray-600 mt-1">
                                    Recommended: ₹{aiSuggestion.pricePoint}/{unit}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {status === 'pending' && (
                <div className="flex gap-2">
                    {/* Only show accept button if user is the receiving party */}
                    {onAccept && (
                        (proposedBy === 'vendor' && !isVendor) ||
                        (proposedBy === 'buyer' && isVendor)
                    ) && (
                            <Button
                                variant="primary"
                                onClick={() => onAccept(offer)}
                                fullWidth
                            >
                                ✓ Accept Offer
                            </Button>
                        )}
                    {/* Show counter button for receiving party or waiting message for sender */}
                    {((proposedBy === 'vendor' && !isVendor) || (proposedBy === 'buyer' && isVendor)) ? (
                        onCounter && (
                            <Button
                                variant="secondary"
                                onClick={() => onCounter(offer)}
                                fullWidth
                            >
                                💬 Counter Offer
                            </Button>
                        )
                    ) : (
                        <div className="text-center py-2 px-4 bg-gray-100 rounded-lg w-full">
                            <p className="text-sm text-gray-600">
                                ⏳ Waiting for {proposedBy === 'vendor' ? 'buyer' : 'vendor'} response...
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default OfferCard;
