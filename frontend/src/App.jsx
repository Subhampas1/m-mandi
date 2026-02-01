import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';

// Pages (will create these next)
import Landing from './pages/Landing';
import LanguageSelect from './pages/LanguageSelect';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorDashboard from './pages/VendorDashboard';
import VendorNegotiations from './pages/VendorNegotiations';
import BuyerMarketplace from './pages/BuyerMarketplace';
import BuyerNegotiations from './pages/BuyerNegotiations';
import ImpactPage from './pages/ImpactPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <SocketProvider>
                    <Router>
                        <div className="min-h-screen">
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Landing />} />
                                <Route path="/language-select" element={<LanguageSelect />} />
                                <Route path="/role-select" element={<RoleSelect />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/impact" element={<ImpactPage />} />

                                {/* Protected routes */}
                                <Route
                                    path="/vendor"
                                    element={
                                        <ProtectedRoute>
                                            <VendorDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/vendor/negotiations"
                                    element={
                                        <ProtectedRoute>
                                            <VendorNegotiations />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/marketplace"
                                    element={
                                        <ProtectedRoute>
                                            <BuyerMarketplace />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/buyer/negotiations"
                                    element={
                                        <ProtectedRoute>
                                            <BuyerNegotiations />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </Router>
                </SocketProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
