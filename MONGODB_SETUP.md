# Setting Up MongoDB for The Multilingual Mandi

## Quick Setup Guide

You have **3 options** to get MongoDB running:

---

## Option 1: MongoDB Atlas (Cloud - Recommended) ☁️

**Best for**: Quick testing without local installation

### Steps:

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose **M0 Free** tier
   - Select a region close to you
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `mandiuser`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"

4. **Allow Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://mandiuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update Backend `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://mandiuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/multilingual-mandi?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` and the cluster URL with your actual values.

7. **Run Seed Script**:
   ```bash
   cd backend
   npm run seed
   ```

---

## Option 2: Local MongoDB Installation 💻

**Best for**: Development without internet dependency

### Windows:

1. **Download**: Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select Windows
   - Download MSI installer

2. **Install**:
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (optional GUI)

3. **Verify Installation**:
   ```bash
   mongod --version
   ```

4. **Start MongoDB** (if not running as service):
   ```bash
   mongod --port 27017 --dbpath C:\data\db
   ```

5. **Your `.env` should have**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/multilingual-mandi
   ```

6. **Run Seed Script**:
   ```bash
   cd backend
   npm run seed
   ```

### macOS:

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Run seed script
cd backend
npm run seed
```

### Linux (Ubuntu):

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod

# Run seed script
cd backend
npm run seed
```

---

## Option 3: Docker (Advanced) 🐳

**Best for**: Isolated development environment

### Steps:

1. **Install Docker Desktop**: [Get Docker](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB Container**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Your `.env` should have**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/multilingual-mandi
   ```

4. **Run Seed Script**:
   ```bash
   cd backend
   npm run seed
   ```

5. **Stop Container** (when done):
   ```bash
   docker stop mongodb
   ```

6. **Start Container** (next time):
   ```bash
   docker start mongodb
   ```

---

## Running the Seed Script

Once MongoDB is running, populate with test data:

```bash
cd backend
npm run seed
```

### Expected Output:

```
🌱 Starting database seeding...

🗑️  Clearing existing data...
✅ Existing data cleared

👥 Creating mock users...
   ✓ Created vendor: Rajesh Kumar (vendor1@test.com)
   ✓ Created vendor: Priya Sharma (vendor2@test.com)
   ✓ Created buyer: Amit Patel (buyer1@test.com)
   ✓ Created buyer: Lakshmi Devi (buyer2@test.com)
   ✓ Created both: Suresh Reddy (both@test.com)
✅ Created 5 users

🌾 Creating mock commodities...
✅ Created 13 commodities

📊 Seeding Summary:
──────────────────────────────────────────────────
   Users Created: 5
   - Vendors: 2
   - Buyers: 2
   - Both: 1
   Commodities Created: 13
──────────────────────────────────────────────────

🎉 Database seeding completed successfully!

📝 Test Credentials:
──────────────────────────────────────────────────
   VENDOR: vendor1@test.com / password123
   VENDOR: vendor2@test.com / password123
   BUYER: buyer1@test.com / password123
   BUYER: buyer2@test.com / password123
   BOTH: both@test.com / password123
──────────────────────────────────────────────────
```

---

## Test Accounts

After seeding, you can login with these accounts:

| Email | Password | Role | Language | Location |
|-------|----------|------|----------|----------|
| vendor1@test.com | password123 | Vendor | Hindi | Mumbai, Maharashtra |
| vendor2@test.com | password123 | Vendor | English | Pune, Maharashtra |
| buyer1@test.com | password123 | Buyer | Gujarati | Ahmedabad, Gujarat |
| buyer2@test.com | password123 | Buyer | Tamil | Chennai, Tamil Nadu |
| both@test.com | password123 | Both | Telugu | Hyderabad, Telangana |

---

## Mock Commodities Created

The seed script creates **13 diverse commodities**:

### Vegetables (4):
- Fresh Tomatoes (Premium, 100kg, ₹45/kg)
- Onions (Standard, 200kg, ₹30/kg)
- Potatoes (Standard, 150kg, ₹25/kg)
- Green Chillies (Premium, 50kg, ₹60/kg)

### Fruits (3):
- Alphonso Mangoes (Premium, 75kg, ₹250/kg)
- Bananas (Standard, 120 dozen, ₹40/dozen)
- Pomegranates (Premium, 60kg, ₹120/kg)

### Grains (2):
- Basmati Rice (Premium, 500kg, ₹80/kg)
- Wheat (Standard, 300kg, ₹35/kg)

### Pulses (2):
- Toor Dal (Premium, 200kg, ₹120/kg)
- Moong Dal (Standard, 150kg, ₹140/kg)

### Spices (2):
- Turmeric Powder (Premium, 80kg, ₹280/kg)
- Red Chilli Powder (Premium, 100kg, ₹350/kg)

All commodities include:
- AI-suggested price ranges
- Quality grades
- Location information
- Detailed descriptions

---

## Troubleshooting

### Error: "connect ECONNREFUSED"
**Problem**: MongoDB is not running

**Solutions**:
- **MongoDB Atlas**: Check your connection string and network access settings
- **Local MongoDB**: Start the MongoDB service
  - Windows: `net start MongoDB`
  - macOS: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`
- **Docker**: `docker start mongodb`

### Error: "Authentication failed"
**Problem**: Wrong credentials in connection string

**Solution**: Double-check username and password in `MONGODB_URI`

### Error: "Database not found"
**Problem**: Database will be created automatically on first connection

**Solution**: This is normal; the database is created when you first insert data

---

## Verifying the Setup

1. **Check if MongoDB is running**:
   ```bash
   # For Atlas: Try connecting from Compass or MongoDB Shell

   # For local MongoDB:
   mongosh  # or mongo
   show dbs
   ```

2. **Check if data was seeded**:
   ```bash
   mongosh mongodb://localhost:27017/multilingual-mandi

   # In MongoDB shell:
   show collections
   db.users.countDocuments()  # Should show 5
   db.commodities.countDocuments()  # Should show 13
   ```

3. **Test the API**:
   ```bash
   # Get all commodities
   curl http://localhost:5000/api/commodities
   ```

---

## Next Steps

After MongoDB is set up and seeded:

1. ✅ Restart backend server (if it was running): `npm run dev`
2. ✅ Open frontend: http://localhost:5173
3. ✅ Login with any test account
4. ✅ Start testing features!

---

**Quick Recommendation**: Use **MongoDB Atlas** for the fastest setup—no installation required, just sign up and get a connection string! ☁️
