# Deployment Guide - The Multilingual Mandi

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Gemini API key from Google AI Studio
- Git for version control

---

## Backend Deployment

### Option 1: Render (Recommended)

1. **Prepare Backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Create `render.yaml`** in root:
   ```yaml
   services:
     - type: web
       name: mandi-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 5000
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: GEMINI_API_KEY
           sync: false
         - key: FRONTEND_URL
           value: https://your-frontend-url.vercel.app
   ```

3. **Push to GitHub** and connect to Render

4. **Set Environment Variables** in Render Dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Random secure string (use `openssl rand -base64 32`)
   - `GEMINI_API_KEY`: Your Google AI API key
   - `FRONTEND_URL`: Your deployed frontend URL

### Option 2: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Initialize**:
   ```bash
   railway init
   railway link
   ```

3. **Set Variables**:
   ```bash
   railway variables set MONGODB_URI="your-mongodb-uri"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set GEMINI_API_KEY="your-gemini-key"
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Update `frontend/.env.production`**:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure in Vercel Dashboard**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Create `netlify.toml`** in frontend:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via CLI**:
   ```bash
   npm install -g netlify-cli
   cd frontend
   netlify deploy --prod
   ```

---

## Database Setup (MongoDB Atlas)

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Choose a region close to your backend host

2. **Configure Access**:
   - Database Access → Add User (save credentials)
   - Network Access → Add IP (0.0.0.0/0 for access from anywhere)

3. **Get Connection String**:
   - Clusters → Connect → Connect Your Application
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/mandi?retryWrites=true&w=majority`

---

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-google-ai-key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.com/health`
- [ ] Test user registration
- [ ] Test user login
- [ ] Test commodity listing
- [ ] Test AI price discovery
- [ ] Test real-time negotiation
- [ ] Test voice input
- [ ] Verify CORS settings
- [ ] Check WebSocket connection
- [ ] Monitor API rate limits

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches deployed frontend URL
- Check CORS configuration in `backend/src/server.js`

### WebSocket Connection Failed
- Verify Socket.io is properly initialized
- Check firewall/security group settings
- Ensure WebSocket protocol is allowed

### API 500 Errors
- Check backend logs in hosting dashboard
- Verify all environment variables are set
- Test MongoDB connection string

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Review build logs for specific errors

---

## Monitoring & Maintenance

### Backend Monitoring
- Enable logging in production
- Set up error tracking (Sentry)
- Monitor MongoDB Atlas metrics
- Track API response times

### Frontend Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user engagement

### Regular Updates
- Keep dependencies updated: `npm update`
- Review security advisories: `npm audit`
- Backup MongoDB regularly
- Rotate JWT secrets periodically

---

## Scaling Considerations

### Backend
- Enable clustering for Node.js
- Use Redis for session storage
- Implement CDN for static assets
- Add database read replicas

### Frontend
- Enable Vercel Edge Network
- Optimize bundle size
- Implement lazy loading
- Use service workers for caching

---

## Cost Estimation (Free Tier)

- **MongoDB Atlas**: Free M0 cluster (512MB storage)
- **Render/Railway**: Free tier (750 hours/month)
- **Vercel/Netlify**: Free tier (100GB bandwidth)
- **Total**: $0/month for MVP

### Paid Tier Upgrade (Recommended for Production)
- **MongoDB Atlas M10**: ~$57/month
- **Render Starter**: $7/month
- **Vercel Pro**: $20/month
- **Total**: ~$84/month

---

**Deployment is now ready! Your Multilingual Mandi is live! 🎉**
