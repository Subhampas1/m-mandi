import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { ROLES } from '../../utils/constants';

const RegisterForm = ({ onSubmit, loading = false, currentLanguage = 'hindi' }) => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: searchParams.get('role') || 'both',
        preferredLanguage: currentLanguage
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const result = await onSubmit({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: formData.role,
            preferredLanguage: formData.preferredLanguage
        });

        if (!result.success) {
            setError(result.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-600">Join the Digital Mandi</p>
            </div>

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                />

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
                    label="Phone (Optional)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                />

                <Select
                    label="I am a"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={ROLES}
                />

                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    fullWidth
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-saffron-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
