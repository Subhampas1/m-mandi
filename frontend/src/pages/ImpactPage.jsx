import { Link } from 'react-router-dom';

const ImpactPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-mandi-cream via-white to-saffron-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Powering a <span className="text-saffron-600">Viksit Bharat</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700">
                        Through AI-Powered Inclusive Trade
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="card text-center">
                        <div className="text-5xl font-bold text-saffron-600 mb-2">22+</div>
                        <div className="text-lg font-semibold mb-2">Official Languages</div>
                        <p className="text-gray-600">All voices heard, all markets connected</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-5xl font-bold text-saffron-600 mb-2">100%</div>
                        <div className="text-lg font-semibold mb-2">Price Transparency</div>
                        <p className="text-gray-600">AI ensures fairness for every transaction</p>
                    </div>
                    <div className="card text-center">
                        <div className="text-5xl font-bold text-saffron-600 mb-2">Millions</div>
                        <div className="text-lg font-semibold mb-2">Empowered Vendors</div>
                        <p className="text-gray-600">Digital access without literacy barriers</p>
                    </div>
                </div>

                {/* Vision */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        🇮🇳 How This Builds Viksit Bharat
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="card">
                            <div className="text-4xl mb-4">🗣️</div>
                            <h3 className="text-xl font-bold mb-3">Linguistic Inclusion</h3>
                            <p className="text-gray-700">
                                Turning India's language diversity into economic strength through AI translation
                            </p>
                        </div>
                        <div className="card">
                            <div className="text-4xl mb-4">⚖️</div>
                            <h3 className="text-xl font-bold mb-3">Economic Justice</h3>
                            <p className="text-gray-700">
                                Transparent pricing ends exploitative practices in local markets
                            </p>
                        </div>
                        <div className="card">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-xl font-bold mb-3">Digital Empowerment</h3>
                            <p className="text-gray-700">
                                Voice-first design includes low-literacy users in digital economy
                            </p>
                        </div>
                        <div className="card">
                            <div className="text-4xl mb-4">🌾</div>
                            <h3 className="text-xl font-bold mb-3">Grassroots Growth</h3>
                            <p className="text-gray-700">
                                AI assists millions of small vendors to compete fairly
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="card bg-gradient-to-r from-saffron-500 to-orange-500 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">This is Generative AI for India</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Not replacing human connection, but enabling it across every language, every state, every mandi.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/" className="bg-white text-saffron-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100">
                            ↻ Experience Again
                        </Link>
                        <Link to="/language-select" className="bg-saffron-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-saffron-800">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpactPage;
