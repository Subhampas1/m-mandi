import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { CATEGORIES, QUALITY_GRADES, UNITS } from '../../utils/constants';

const CommodityForm = ({ onSubmit, onGetAIPrice, loading = false, aiPrice = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'vegetables',
        quantity: '',
        unit: 'kg',
        price: '',
        quality: 'Standard',
        location: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleGetPrice = () => {
        if (!formData.name || !formData.quantity || !formData.location) {
            alert('Please fill in commodity name, quantity, and location first');
            return;
        }
        onGetAIPrice(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Commodity Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Tomatoes, Rice, Wheat"
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={CATEGORIES}
                />

                <Select
                    label="Quality"
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    options={QUALITY_GRADES}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="Enter quantity"
                />

                <Select
                    label="Unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    options={UNITS}
                />
            </div>

            <Input
                label="Location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                required
            />

            <Input
                label="Description (Optional)"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about your commodity"
            />

            <Button
                type="button"
                variant="secondary"
                onClick={handleGetPrice}
                disabled={loading}
                fullWidth
            >
                {loading ? 'Analyzing...' : '✨ Get AI Price Suggestion'}
            </Button>

            {aiPrice && (
                <Input
                    label={`Your Price (₹/${formData.unit})`}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="Enter your price"
                />
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={!aiPrice}
                fullWidth
            >
                List Commodity
            </Button>

            {!aiPrice && (
                <p className="text-sm text-gray-600 text-center">
                    Get AI price suggestion before listing
                </p>
            )}
        </form>
    );
};

export default CommodityForm;
