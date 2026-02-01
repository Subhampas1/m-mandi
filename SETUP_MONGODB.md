## 🗄️ MongoDB Not Running

I noticed MongoDB is not running on your system. You have **3 options**:

### Option 1: MongoDB Atlas (Fastest - Recommended) ☁️
1. Create free account: https://www.mongodb.com/cloud/atlas/register
2. Create M0 Free cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/multilingual-mandi
   ```
5. Run: `npm run seed`

### Option 2: Install MongoDB Locally 💻
**Windows**:
- Download: https://www.mongodb.com/try/download/community
- Install and start service
- Connection string already in `.env`: `mongodb://localhost:27017/multilingual-mandi`
- Run: `npm run seed`

### Option 3: Use Docker 🐳
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
npm run seed
```

---

## 📋 What the Seed Script Creates

Once MongoDB is running, `npm run seed` will create:

### 👥 5 Test Users:
- **vendor1@test.com** / password123 (Rajesh Kumar - Mumbai)
- **vendor2@test.com** / password123 (Priya Sharma - Pune)
- **buyer1@test.com** / password123 (Amit Patel - Ahmedabad)
- **buyer2@test.com** / password123 (Lakshmi Devi - Chennai)
- **both@test.com** / password123 (Suresh Reddy - Hyderabad)

### 🌾 13 Commodities:
- **Vegetables**: Tomatoes, Onions, Potatoes, Green Chillies
- **Fruits**: Alphonso Mangoes, Bananas, Pomegranates
- **Grains**: Basmati Rice, Wheat
- **Pulses**: Toor Dal, Moong Dal
- **Spices**: Turmeric Powder, Red Chilli Powder

All with AI-suggested prices, quality grades, and realistic data!

---

## 🚀 Quick Start (Recommended)

**Fastest option - MongoDB Atlas (2 minutes)**:
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create M0 cluster
3. Copy connection string
4. Update `backend/.env` with the connection string
5. Run: `npm run seed`
6. Done! Your app now has users and products to test with

See `MONGODB_SETUP.md` for detailed instructions.
