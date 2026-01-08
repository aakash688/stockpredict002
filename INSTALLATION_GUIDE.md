# 🚀 Installation Guide - Stock Analysis Platform

Complete step-by-step guide to install and run the application on a fresh computer.

---

## Prerequisites

Before starting, ensure you have:

- **Python 3.10+** installed ([Download](https://www.python.org/downloads/))
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/))
- **MySQL** or **PostgreSQL** (for production) or SQLite (for development)

---

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd "Stock Predictions"
```

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Create Virtual Environment

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected Output**: All packages installed successfully

### 2.4 Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
# For Development (SQLite - no setup needed):
# DATABASE_URL=sqlite:///./stockdb.db

# For Production (MySQL):
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/database_name?charset=utf8mb4

# For Production (PostgreSQL):
# DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Redis - Upstash (Optional - app works without it)
REDIS_URL=redis://default:your_redis_password@your_redis_host:6379

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-generate-random-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# API Keys (Optional - some features work without them)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key
EXCHANGE_RATE_API_KEY=your_exchange_rate_key

# CORS - Allow frontend origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

**Important Notes**:
- Replace `your-secret-key-here-generate-random-string` with a random string (use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- API keys are optional - the app uses yfinance (free) as primary data source
- For development, SQLite works without any database setup

### 2.5 Start Backend Server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
Database tables created successfully!
```

**✅ Backend is running when you see**: `Uvicorn running on http://127.0.0.1:8000`

---

## Step 3: Frontend Setup

### 3.1 Open New Terminal

Keep the backend running, open a new terminal window.

### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

**Expected Output**: All packages installed successfully

### 3.4 Create Environment File

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

**For Production**, use:
```env
VITE_API_URL=https://your-backend-api-url.com
```

### 3.5 Start Frontend Server

```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend is running when you see**: `Local: http://localhost:5173/`

---

## Step 4: Verify Installation

### 4.1 Open Application

1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the landing page

### 4.2 Test Sign Up

1. Click **"Sign Up"** or go to: http://localhost:5173/signup
2. Fill in the form:
   - **Full Name**: `Test User`
   - **Email**: `test@example.com`
   - **Password**: `Test1234` (must have uppercase, lowercase, number, 8+ chars)
   - **Confirm Password**: `Test1234`
3. Click **"Sign Up"**
4. ✅ You should be redirected to Dashboard

### 4.3 Test Stock Search

1. Use the search bar at the top
2. Type: `AAPL` (Apple stock)
3. Click on the result
4. ✅ You should see stock details, chart, and predictions

---

## Troubleshooting

### Backend Won't Start?

**Issue**: Port 8000 already in use

**Solution**:
```bash
# Windows
netstat -ano | findstr ":8000"
# Kill the process or use different port

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

**Issue**: Module not found errors

**Solution**:
```bash
# Make sure virtual environment is activated
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue**: Database connection error

**Solution**:
- For development: Use SQLite (no setup needed)
- For production: Check database credentials in `.env`

### Frontend Won't Start?

**Issue**: Port 5173 already in use

**Solution**:
```bash
# Windows
netstat -ano | findstr ":5173"

# Linux/Mac
lsof -i :5173
```

**Issue**: Module not found errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API connection error

**Solution**:
- Check backend is running on http://localhost:8000
- Verify `VITE_API_URL` in frontend `.env` file
- Check browser console (F12) for errors

### Stock Data Not Loading?

**Issue**: Yahoo Finance rate limiting

**Solution**:
- Wait 30-60 seconds between requests
- Data is cached for 15 minutes
- This is normal for free API tier

**Issue**: "Insufficient historical data"

**Solution**:
- Try different stock symbols (AAPL, MSFT, GOOGL work well)
- Some stocks may not have enough data

---

## Quick Start Commands

### Start Backend
```bash
cd backend
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Stop Servers
Press `Ctrl+C` in each terminal

---

## Production Setup

### Backend Production

1. Update `.env` with production database URL
2. Set strong `JWT_SECRET_KEY`
3. Update `CORS_ORIGINS` with your domain
4. Use production server:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
   ```

### Frontend Production

1. Update `.env` with production API URL
2. Build for production:
   ```bash
   npm run build
   ```
3. Deploy `dist` folder to hosting (Vercel, Netlify, etc.)

**See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for detailed production setup.**

---

## Environment Variables Reference

### Backend `.env`

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Database connection string | Yes | `sqlite:///./stockdb.db` |
| `REDIS_URL` | Redis connection string | No | `redis://...` |
| `JWT_SECRET_KEY` | Secret for JWT tokens | Yes | Random 32+ char string |
| `JWT_ALGORITHM` | JWT algorithm | Yes | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | Yes | `1440` |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | No | `...` |
| `FINNHUB_API_KEY` | Finnhub API key | No | `...` |
| `EXCHANGE_RATE_API_KEY` | ExchangeRate API key | No | `...` |
| `CORS_ORIGINS` | Allowed frontend origins | Yes | `http://localhost:5173` |

### Frontend `.env`

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | `http://localhost:8000` |

---

## Next Steps

1. ✅ Installation complete
2. ✅ Both servers running
3. ✅ Application accessible at http://localhost:5173
4. 📖 Read [USER_GUIDE.md](USER_GUIDE.md) to learn how to use the app
5. 📖 Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
6. 📖 Read [IMPLEMENTATION_DETAILS.md](IMPLEMENTATION_DETAILS.md) for technical details

---

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify all prerequisites are installed
3. Check backend logs for errors
4. Check browser console (F12) for frontend errors
5. Ensure both servers are running

---

**Installation Date**: January 2026  
**Version**: 1.0.0
