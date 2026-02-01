import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const RoleSelect = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [selectedRole, setSelectedRole] = useState(user?.role || null);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);

        // If not authenticated, redirect to register with role
        if (!isAuthenticated) {
            navigate(`/register?role=${role}`);
            return;
        }

        // Navigate based on role
        if (role === 'vendor' || role === 'both') {
            navigate('/vendor');
        } else {
            navigate('/marketplace');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mandi-cream to-saffron-50 p-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <button
                        onClick={() => navigate('/.')}
                        className="text-saffron-700 hover:text-saffron-800 mb-4 flex items-center gap-2 mx-auto"
                    >
                        <span>←</span> {t('back')}
                    </button>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('iAm')}</h2>
                    <p className="text-xl text-gray-700">{t('whatAreYou')}</p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {ROLES.map((role) => (
                        <button
                            key={role.value}
                            onClick={() => handleRoleSelect(role.value)}
                            className={`card text-center transition-all duration-200 hover:scale-105 ${selectedRole === role.value
                                ? 'border-4 border-saffron-600 bg-saffron-50'
                                : 'hover:border-2 hover:border-saffron-300'
                                }`}
                        >
                            <div className="text-6xl mb-4">{role.icon}</div>
                            <h3 className="text-2xl font-bold mb-3">{t(role.value)}</h3>
                            <p className="text-gray-700 mb-4">{t(role.value + 'Desc')}</p>

                            {role.value === 'vendor' && (
                                <ul className="text-sm text-left space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('listCommodities')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('getAIPriceSuggestions')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('acceptOffers')}
                                    </li>
                                </ul>
                            )}

                            {role.value === 'buyer' && (
                                <ul className="text-sm text-left space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('browseMandi')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('comparePrices')}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>✓</span> {t('negotiateDeals')}
                                    </li>
                                </ul>
                            )}

                            {role.value === 'both' && (
                                <p className="text-sm text-gray-600">
                                    {t('fullAccessToBuyAndSell')}
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelect;
