# The Multilingual Mandi - Backend API

**Production-ready Node.js backend for AI-powered multilingual marketplace**

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Gemini API Key

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

### Configuration

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "vendor",
  "preferredLanguage": "hindi"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Commodity Endpoints

#### Get All Commodities
```http
GET /api/commodities?category=vegetables&status=active&limit=20
```

#### Get Single Commodity
```http
GET /api/commodities/:id
```

#### Create Commodity (Vendor only)
```http
POST /api/commodities
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tomatoes",
  "category": "vegetables",
  "quantity": 100,
  "unit": "kg",
  "price": 50,
  "quality": "A-Grade",
  "location": "Maharashtra",
  "aiSuggestedPrice": {
    "min": 45,
    "max": 55,
    "confidence": 92
  }
}
```

### AI Service Endpoints

#### Price Discovery
```http
POST /api/ai/price-discovery
Authorization: Bearer {token}
Content-Type: application/json

{
  "commodityName": "Tomatoes",
  "quantity": 100,
  "unit": "kg",
  "location": "Maharashtra",
  "quality": "A-Grade"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "suggestedPrice": {
      "min": 45,
      "max": 55
    },
    "confidence": 92,
    "factors": [
      {
        "type": "regional_average",
        "description": "₹48/kg in Maharashtra",
        "impact": "high"
      }
    ]
  }
}
```

#### Translation
```http
POST /api/ai/translate
Content-Type: application/json

{
  "text": "Hello, how are you?",
  "targetLang": "hindi",
  "sourceLang": "english"
}
```

#### Negotiation Assistant
```http
POST /api/ai/negotiation-assist
Authorization: Bearer {token}
Content-Type: application/json

{
  "commodityName": "Tomatoes",
  "vendorPrice": 550,
  "buyerOffer": 450,
  "aiPrice": { "min": 480, "max": 520 },
  "language": "hindi"
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   ├── ai.js        # Gemini AI setup
│   │   └── translate.js # Translation service
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Commodity.js
│   │   ├── Negotiation.js
│   │   └── Transaction.js
│   ├── routes/          # Express routes
│   │   ├── auth.js
│   │   ├── commodities.js
│   │   └── ai.js
│   ├── controllers/     # Route controllers
│   │   ├── authController.js
│   │   ├── commodityController.js
│   │   └── aiController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   └── server.js        # Express app
├── .env.example
├── package.json
└── README.md
```

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling

## 🤖 AI Features

### Gemini AI Integration
- **Price Discovery**: AI-powered market price analysis
- **Negotiation Assistant**: Smart counter-offer suggestions
- **Multilingual Support**: Real-time translation

### Translation Service
- Supports 10+ Indian languages
- Fallback to LibreTranslate (free)
- Google Translate API (optional)

## 🗄️ Database Models

### User
- Authentication & profile
- Role-based access (vendor/buyer/both)
- Language preferences

### Commodity
- Product listings
- AI price suggestions
- Multilingual names
- Auto-expiry

### Negotiation
- Real-time messages
- AI suggestions
- Fair trade scoring

### Transaction
- Deal records
- Payment tracking

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret for JWT signing | Yes |
| GEMINI_API_KEY | Gemini AI API key | Yes |
| PORT | Server port | No (default: 5000) |
| FRONTEND_URL | Frontend URL for CORS | No |
| GOOGLE_TRANSLATE_KEY | Google Translate API | No |

## 🚀 Deployment

### Render/Railway

1. Connect your GitHub repository
2. Set environment variables
3. Build command: `npm install`
4. Start command: `node src/server.js`

### MongoDB Atlas

1. Create cluster
2. Whitelist IP addresses
3. Create database user
4. Copy connection string

## 📊 API Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"vendor"}'
```

## 📄 License

MIT

---

*Built for The Multilingual Mandi - 26 Jan Prompt Challenge 2025*
