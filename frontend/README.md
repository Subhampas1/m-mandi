# The Multiple Lingual Mandi - Frontend

**React + Vite frontend for AI-powered multilingual marketplace**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend server running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── Landing.jsx
│   │   ├── LanguageSelect.jsx
│   │   ├── RoleSelect.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VendorDashboard.jsx
│   │   ├── BuyerMarketplace.jsx
│   │   └── ImpactPage.jsx
│   ├── context/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── hooks/          # Custom hooks
│   │   └── useVoiceRecognition.js
│   ├── services/       # API services
│   │   └── api.js
│   ├── utils/          # Constants and utilities
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/
│   └── assets/         # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Features

### Voice-First Design
- Web Speech API integration
- Support for 6+ Indian languages
- Fallback to manual input

### Real-Time AI
- Gemini AI price discovery
- Translation service
- Negotiation assistance

### Responsive Design
- Mobile-first approach
- TailwindCSS styling
- India-inspired color palette

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Register new account
- Login with email/password
- Auto-redirect based on role
- Protected routes for vendor/buyer

## 📱 Pages Overview

### Public Pages
- **Landing** - Hero and features
- **Language Select** - Choose preferred language with voice
- **Role Select** - Choose vendor/buyer/both
- **Login** - Authentication
- **Register** - Sign up
- **Impact** - Vision and metrics

### Protected Pages
- **Vendor Dashboard** - List commodities, get AI prices
- **Buyer Marketplace** - Browse and filter commodities

## 🌐 API Integration

All API calls go through `src/services/api.js`:
- Axios instance with interceptors
- Auto-adds JWT token
- Handles 401 redirects

## 🎤 Voice Recognition

Uses Web Speech API via custom hook:
```javascript
const { isListening, transcript, startListening } = useVoiceRecognition('hindi');
```

Supported languages: Hindi, Tamil, Bengali, Marathi, Telugu, English

## 💻 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 User Flows

### Vendor Flow
1. Landing → Language Select → Role Select (Vendor)
2. Register/Login
3. Vendor Dashboard
4. Add commodity → Get AI price → List

### Buyer Flow
1. Landing → Language Select → Role Select (Buyer)
2. Register/Login
3. Marketplace
4. Browse/Filter → Start negotiation

## 🌟 Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Web Speech API** - Voice input

## 📦 Build

```bash
npm run build
```

Output in `dist/` folder ready for deployment to:
- Vercel
- Netlify
- Any static hosting

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repo
2. Set environment variable: `VITE_API_URL`
3. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables

## 🎨 Design System

### Colors
- Saffron: `#f97316` (primary)
- Mandi Green: `#138808`
- Cream: `#FFF9E6` (background)
- Terracotta: `#D2691E`

### Typography
- Headers: Poppins
- Body: Inter

### Components
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input-field` - Form input
- `.voice-button` - Voice input button

## 📄 License

MIT

---

*Built for The Multilingual Mandi - 26 Jan Prompt Challenge 2025*
