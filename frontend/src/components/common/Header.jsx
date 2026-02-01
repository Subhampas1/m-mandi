import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Header = ({ showLogout = false, showBack = false, backTo = '/' }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { currentLanguage, getLanguageName, changeLanguage, languages, t } = useLanguage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Left: Logo/Title */}
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button
                                onClick={() => navigate(backTo)}
                                className="text-saffron-700 hover:text-saffron-800 mr-2"
                                aria-label="Go back"
                            >
                                ← {t('back') || 'Back'}
                            </button>
                        )}
                        <Link to="/" className="flex items-center gap-3">
                            <span className="text-3xl">🛒</span>
                            <div>
                                <h1 className="text-xl font-bold">The Multilingual Mandi</h1>
                                {user && (
                                    <p className="text-sm text-gray-600">
                                        🗣️ {getLanguageName(currentLanguage)}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Right: Language Selector, User Info & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <select
                            value={currentLanguage}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                            title={t('language') || 'Language'}
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.nativeName}
                                </option>
                            ))}
                        </select>

                        {user ? (
                            <>
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-600 capitalize">{t(user.role)}</p>
                                </div>
                                {showLogout && (
                                    <div className="relative" ref={dropdownRef}>
                                        {/* Profile Button */}
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors"
                                        >
                                            <span className="text-lg">👤</span>
                                            <span className="hidden md:inline">{t('myProfile')}</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                                {/* User Info in Dropdown */}
                                                <div className="px-4 py-3 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-600 capitalize">{t(user.role)}</p>
                                                </div>

                                                {/* Menu Items */}
                                                {/* My Negotiations for Buyers */}
                                                {user.role === 'buyer' && (
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileOpen(false);
                                                            navigate('/buyer/negotiations');
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span className="text-lg">💬</span>
                                                        <span className="text-sm text-gray-700">{t('myNegotiations') || 'My Negotiations'}</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        navigate('/purchase-history');
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="text-lg">📦</span>
                                                    <span className="text-sm text-gray-700">{t('purchaseHistory')}</span>
                                                </button>

                                                <div className="border-t border-gray-200 my-1"></div>

                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="text-lg">🚪</span>
                                                    <span className="text-sm text-red-600 font-semibold">{t('logout')}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2 text-saffron-700 hover:text-saffron-800 font-semibold"
                            >
                                {t('login')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
