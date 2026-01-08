# 🚀 Stock Analysis & Prediction Platform

A full-stack web application for stock analysis, AI-powered price predictions, portfolio tracking, and watchlist management.

## ✅ Status: FULLY WORKING!

- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:5173  
- ✅ Database created and functional
- ✅ All features working (stock data, charts, predictions, auth, watchlist, portfolio)
- ⚠️ Redis caching disabled (optional, app works fine without it)
- ⚠️ Plotly warning (harmless, doesn't affect functionality)

## ✨ Features

- 🔐 User Authentication (Signup/Login with JWT)
- 🔍 Real-time Stock Search
- 📈 Interactive Charts (7 time periods: 1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y)
- 🤖 AI Price Predictions (Prophet ML model)
- ⭐ Watchlist Management
- 💼 Portfolio Tracking with P/L calculations
- 💱 Currency Conversion
- 📰 Stock News Feed
- 👨‍💼 Admin Panel
- 🌓 Dark/Light Mode
- 📱 Fully Responsive Design

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, React Query, Zustand, ApexCharts  
**Backend:** FastAPI, SQLAlchemy, SQLite, Redis, Prophet, bcrypt  
**APIs:** yfinance, Finnhub, Alpha Vantage, ExchangeRate-API  
**Hosting:** Vercel (Frontend), Render (Backend), Supabase (Database), Upstash (Redis)

## 🚀 Quick Start (Development)

### 1. Start Backend Server

Open Terminal 1:
```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**✅ Wait for:** `Uvicorn running on http://127.0.0.1:8000`

### 2. Start Frontend Server

Open Terminal 2:
```powershell
cd frontend
npm run dev
```

**✅ Wait for:** `Local: http://localhost:5173/`

### 3. Open Application

1. Open browser: **http://localhost:5173**
2. Sign up with your email
3. Start exploring!

**📖 For detailed installation, see [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)**

## 🚀 Production Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm install
npm run build:prod
# Output: frontend/dist/
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

**📖 For complete production setup, see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)**

## 📚 Documentation

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete installation guide for fresh setup
- **[FREE_HOSTING_GUIDE.md](FREE_HOSTING_GUIDE.md)** - 🆓 **Complete free hosting guide (Vercel + Render + Supabase)**
- **[USER_GUIDE.md](USER_GUIDE.md)** - How to use the application
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API structure and usage guide
- **[IMPLEMENTATION_DETAILS.md](IMPLEMENTATION_DETAILS.md)** - Technical implementation details, architecture, and logic
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Production deployment guide with checklist

## 🎓 For College Project

This is a professional-grade application featuring:
- Full-stack architecture
- Machine learning integration
- Real stock market data
- Modern UI/UX
- Production-ready code
- Complete documentation
- Free hosting strategy

Perfect for demonstrating:
- Full-stack development skills
- API integration
- ML/AI implementation
- Database design
- Authentication & security
- Modern frontend frameworks
- RESTful API design

## ⚠️ Disclaimer

This platform is for **educational purposes only**. Not financial advice. Past performance does not guarantee future results.

## 📄 License

MIT License

---

**Your application is ready! Open http://localhost:5173 and start exploring! 🎉**
