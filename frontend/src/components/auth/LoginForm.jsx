import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LoginForm = ({ onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        const result = await onSubmit(formData);
        if (!result.success) {
            setError(result.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-600">Login to your Digital Mandi account</p>
            </div>

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    fullWidth
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-saffron-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>

            <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                    ← Back to home
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
