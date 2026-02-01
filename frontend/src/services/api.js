import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/update-profile', data),
    changePassword: (data) => api.post('/auth/change-password', data)
};

// Commodity APIs
export const commodityAPI = {
    getAll: (params) => api.get('/commodities', { params }),
    getById: (id) => api.get(`/commodities/${id}`),
    create: (data) => api.post('/commodities', data),
    update: (id, data) => api.put(`/commodities/${id}`, data),
    delete: (id) => api.delete(`/commodities/${id}`),
    getByVendor: (vendorId) => api.get(`/commodities/vendor/${vendorId}`)
};

// AI APIs
export const aiAPI = {
    getPriceDiscovery: (data) => api.post('/ai/price-discovery', data),
    translate: (data) => api.post('/ai/translate', data),
    getNegotiationAssist: (data) => api.post('/ai/negotiation-assist', data)
};

// Negotiation APIs
export const negotiationAPI = {
    create: (data) => api.post('/negotiations', data),
    getAll: () => api.get('/negotiations'),
    getById: (id) => api.get(`/negotiations/${id}`),
    updateStatus: (id, status) => api.put(`/negotiations/${id}/status`, { status }),
    getVendorNegotiations: () => api.get('/negotiations/vendor/my-negotiations'),
    getBuyerNegotiations: () => api.get('/negotiations/buyer/my-negotiations'),
};

export default api;
