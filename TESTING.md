# Testing Guide - The Multilingual Mandi

## Overview

This guide covers testing strategies for both backend and frontend components.

---

## Backend API Testing

### Setup

Install testing dependencies:
```bash
cd backend
npm install --save-dev jest supertest @types/jest
```

### Test Configuration

Create `backend/jest.config.js`:
```javascript
export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};
```

### Example Tests

#### 1. Authentication Tests

Create `backend/src/__tests__/auth.test.js`:

```javascript
import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import { connectDB, closeDB } from '../config/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await User.deleteMany({});
  await closeDB();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'buyer',
          preferredLanguage: 'hindi'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123',
          role: 'vendor'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

#### 2. Commodity Tests

Create `backend/src/__tests__/commodities.test.js`:

```javascript
import request from 'supertest';
import app from '../server.js';

let authToken;
let commodityId;

beforeAll(async () => {
  // Login to get token
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'vendor@example.com',
      password: 'password123'
    });
  authToken = res.body.token;
});

describe('Commodity API', () => {
  describe('POST /api/commodities', () => {
    it('should create a new commodity', async () => {
      const res = await request(app)
        .post('/api/commodities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Tomatoes',
          category: 'vegetables',
          quantity: 100,
          unit: 'kg',
          price: 50,
          quality: 'Premium',
          location: 'Mumbai, Maharashtra'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.commodity).toHaveProperty('name', 'Tomatoes');
      commodityId = res.body.commodity._id;
    });
  });

  describe('GET /api/commodities', () => {
    it('should get all active commodities', async () => {
      const res = await request(app)
        .get('/api/commodities')
        .query({ status: 'active' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.commodities)).toBe(true);
    });
  });

  describe('GET /api/commodities/:id', () => {
    it('should get commodity by ID', async () => {
      const res = await request(app)
        .get(`/api/commodities/${commodityId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.commodity).toHaveProperty('_id', commodityId);
    });
  });
});
```

#### 3. AI Service Tests

Create `backend/src/__tests__/ai.test.js`:

```javascript
import request from 'supertest';
import app from '../server.js';

let authToken;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  authToken = res.body.token;
});

describe('AI Service API', () => {
  describe('POST /api/ai/price-discovery', () => {
    it('should get AI price suggestion', async () => {
      const res = await request(app)
        .post('/api/ai/price-discovery')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          commodityName: 'Tomatoes',
          quantity: 100,
          unit: 'kg',
          quality: 'Premium',
          location: 'Mumbai'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('suggestedPrice');
      expect(res.body.suggestedPrice).toHaveProperty('min');
      expect(res.body.suggestedPrice).toHaveProperty('max');
    }, 10000); // Increase timeout for AI API
  });
});
```

### Running Tests

```bash
cd backend
npm test
```

For coverage report:
```bash
npm test -- --coverage
```

---

## Frontend Testing

### Setup

Install testing dependencies:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Vitest Configuration

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

Create `frontend/src/setupTests.js`:
```javascript
import '@testing-library/jest-dom';
```

### Example Tests

#### 1. Component Tests

Create `frontend/src/components/__tests__/Button.test.jsx`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../common/Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### 2. Hook Tests

Create `frontend/src/hooks/__tests__/useAuth.test.js`:

```javascript
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { describe, it, expect } from 'vitest';

describe('useAuth Hook', () => {
  it('provides auth context', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });
});
```

### Running Frontend Tests

```bash
cd frontend
npm test
```

---

## Manual Testing Checklist

### Authentication Flow
- [ ] User can register with all roles (vendor, buyer, both)
- [ ] User can login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Token persists after page refresh
- [ ] Logout clears session

### Vendor Flow
- [ ] Vendor can list new commodity
- [ ] AI price discovery works
- [ ] Commodity appears in vendor dashboard
- [ ] Vendor can edit commodity
- [ ] Vendor can delete commodity

### Buyer Flow
- [ ] Buyer can browse commodities
- [ ] Filter by category works
- [ ] Search functionality works
- [ ] Buyer can start negotiation
- [ ] Real-time chat works

### Real-Time Negotiation
- [ ] WebSocket connects successfully
- [ ] Messages appear instantly
- [ ] Offers update in real-time
- [ ] Fair trade score calculates
- [ ] Both users see same state

### Voice Features
- [ ] Microphone permission requested
- [ ] Voice input captures correctly
- [ ] Supported languages work
- [ ] Fallback for unsupported browsers

### AI Features
- [ ] Price discovery returns valid range
- [ ] Translation works for common phrases
- [ ] Negotiation assistance provides suggestions
- [ ] API rate limiting works

---

## Load Testing

Use Apache Bench or Artillery for load testing:

```bash
# Install Artillery
npm install -g artillery

# Create test scenario artillery.yml
artillery quick --count 100 --num 10 http://localhost:5000/health

# Run load test
artillery run artillery.yml
```

---

## Continuous Integration

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Backend Dependencies
        run: cd backend && npm install

      - name: Run Backend Tests
        run: cd backend && npm test
        env:
          JWT_SECRET: test-secret
          MONGODB_URI: mongodb://localhost:27017/test

      - name: Install Frontend Dependencies
        run: cd frontend && npm install

      - name: Run Frontend Tests
        run: cd frontend && npm test
```

---

**Testing complete! Your application is production-ready! 🧪✅**
