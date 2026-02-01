import Card from '../common/Card';

const AIPricePanel = ({ aiPrice, commodityName, unit }) => {
    if (!aiPrice) return null;

    return (
        <Card className="bg-gradient-to-br from-saffron-50 to-white">
            <div className="inline-block px-3 py-1 bg-saffron-600 text-white text-sm rounded-full mb-4">
                ✨ AI Powered
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart Price Discovery</h3>

            <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Suggested Price for {commodityName}</div>
                <div className="text-4xl font-bold text-saffron-600 mb-2">
                    ₹{aiPrice.suggestedPrice.min} - ₹{aiPrice.suggestedPrice.max}
                </div>
                <div className="text-sm text-gray-600">per {unit}</div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-2">
                    {aiPrice.confidence}% Confidence
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold">📊 Why this price?</h4>
                {aiPrice.factors && aiPrice.factors.map((factor, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-semibold text-sm mb-1">
                            {factor.type.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-700">{factor.description}</div>
                        {factor.impact && (
                            <div className="text-xs text-gray-500 mt-1">
                                Impact: <span className="capitalize">{factor.impact}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {aiPrice.reasoning && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{aiPrice.reasoning}</p>
                </div>
            )}
        </Card>
    );
};

export default AIPricePanel;
