# 📘 Stock Analysis Platform - Complete Implementation Details

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Machine Learning Implementation](#machine-learning-implementation)
5. [Business Logic & Calculations](#business-logic--calculations)
6. [Data Flow](#data-flow)
7. [Authentication & Security](#authentication--security)
8. [Database Schema](#database-schema)
9. [API Integration](#api-integration)
10. [Caching Strategy](#caching-strategy)
11. [Frontend Architecture](#frontend-architecture)
12. [State Management](#state-management)

---

## Architecture Overview

This is a **full-stack web application** built with a modern microservices-inspired architecture:

- **Frontend**: React 18 SPA (Single Page Application)
- **Backend**: FastAPI REST API
- **Database**: MySQL/PostgreSQL (production) or SQLite (development)
- **Cache**: Redis (Upstash) for performance optimization
- **ML Engine**: Facebook Prophet for stock price predictions

### High-Level Flow

```
User Browser → React Frontend → FastAPI Backend → Database/Cache
                                      ↓
                              External APIs (yfinance, Finnhub)
                                      ↓
                              ML Model (Prophet)
```

---

## Technology Stack

### Frontend
- **React 18**: UI library with hooks
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **React Query**: Server state management & caching
- **Zustand**: Client state management (auth, theme, currency)
- **TailwindCSS**: Utility-first CSS framework
- **ApexCharts**: Professional charting library
- **Framer Motion**: Animation library
- **Axios**: HTTP client

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Prophet**: Time series forecasting
- **yfinance**: Stock data fetching
- **Redis**: Caching layer

### External APIs
- **yfinance**: Primary stock data source
- **Finnhub**: News and additional market data
- **Alpha Vantage**: Backup data source
- **ExchangeRate-API**: Currency conversion

---

## System Architecture

### Backend Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── config.py             # Configuration management
│   ├── database.py           # Database connection & models
│   ├── dependencies.py       # Dependency injection
│   ├── api/                  # API routes
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── stocks.py         # Stock data endpoints
│   │   ├── watchlist.py      # Watchlist endpoints
│   │   ├── portfolio.py      # Portfolio endpoints
│   │   ├── predictions.py   # ML prediction endpoints
│   │   └── admin.py           # Admin endpoints
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   │   ├── stock_service.py  # Stock data fetching
│   │   ├── prediction_service.py  # ML predictions
│   │   ├── cache_service.py  # Redis caching
│   │   └── auth_service.py    # Authentication logic
│   └── utils/                # Utility functions
└── requirements.txt
```

### Frontend Structure

```
frontend/
├── src/
│   ├── main.jsx              # Application entry
│   ├── App.jsx               # Root component & routing
│   ├── pages/                # Page components
│   ├── components/           # Reusable components
│   │   ├── layout/           # Layout components
│   │   ├── stock/            # Stock-related components
│   │   ├── portfolio/        # Portfolio components
│   │   └── watchlist/        # Watchlist components
│   ├── services/             # API service layer
│   ├── store/                # Zustand stores
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Utility functions
└── package.json
```

---

## Machine Learning Implementation

### Prophet Model for Stock Predictions

**Model**: Facebook Prophet (Time Series Forecasting)

**Location**: `backend/app/services/prediction_service.py`

### How It Works

1. **Data Collection**
   - Fetches 2 years of historical stock data using `yfinance`
   - Extracts closing prices for training

2. **Data Preparation**
   ```python
   df = pd.DataFrame({
       'ds': hist.index,  # Dates
       'y': hist['Close'].values  # Closing prices
   })
   ```

3. **Model Configuration**
   ```python
   model = Prophet(
       yearly_seasonality=True,    # Annual patterns
       weekly_seasonality=True,    # Weekly patterns
       daily_seasonality=False,    # No daily (market closed)
       changepoint_prior_scale=0.05  # Flexibility parameter
   )
   ```

4. **Training**
   - Model fits on historical data
   - Learns trends, seasonality, and changepoints

5. **Prediction Generation**
   - Creates future dataframe for desired days (7-90)
   - Generates predictions with confidence intervals:
     - `yhat`: Predicted price
     - `yhat_lower`: Lower bound (80% confidence)
     - `yhat_upper`: Upper bound (80% confidence)

6. **Confidence Calculation**
   ```python
   confidence = upper_bound - lower_bound
   # Smaller range = Higher confidence
   ```

7. **Storage**
   - Predictions saved to database
   - Cached in Redis for 24 hours

### Prediction Accuracy

The system calculates accuracy by:
1. Comparing past predictions with actual prices
2. Calculating MAPE (Mean Absolute Percentage Error)
3. Accuracy = `(1 - MAPE) * 100`

**Formula**:
```
MAPE = Σ|actual - predicted| / actual / n
Accuracy = max(0, (1 - MAPE) * 100)
```

---

## Business Logic & Calculations

### Portfolio Profit/Loss Calculation

**Location**: `backend/app/api/portfolio.py`

**Formula**:
```python
total_cost = quantity × purchase_price
current_value = quantity × current_price
profit_loss = current_value - total_cost
profit_loss_percent = (profit_loss / total_cost) × 100
```

**Example**:
- Purchase: 10 shares @ $150 = $1,500
- Current: 10 shares @ $185 = $1,850
- P/L: $350 (23.33% gain)

### Currency Conversion

**Location**: `backend/app/services/stock_service.py`

**Process**:
1. Fetch exchange rate from ExchangeRate-API
2. Cache rate for 1 hour (rates change slowly)
3. Convert all prices using: `converted_price = original_price × exchange_rate`

**Supported Currencies**: USD, EUR, GBP, INR, JPY

### Stock Data Aggregation

**Market Indices**:
- S&P 500, NASDAQ, Dow Jones (US)
- NIFTY 50, NIFTY BANK, SENSEX (India)

**Calculation**:
- Real-time prices from yfinance
- Change = Current - Previous Close
- Change % = (Change / Previous Close) × 100

---

## Data Flow

### Stock Search Flow

```
User types in search → Frontend debounces (300ms)
    ↓
Frontend calls: GET /stocks/search?q=query
    ↓
Backend queries yfinance for matching symbols
    ↓
Returns list of stocks with symbol, name, exchange
    ↓
Frontend displays results in dropdown
    ↓
User selects stock → Navigate to /stock/{symbol}
```

### Stock Detail Flow

```
User views stock → Frontend calls multiple endpoints:
    ↓
GET /stocks/{symbol} → Current price, market cap, etc.
GET /stocks/{symbol}/history?period=1mo → Chart data
GET /stocks/{symbol}/news → News articles
GET /predictions/{symbol}?days=30 → ML predictions
    ↓
All data displayed on single page
```

### Prediction Generation Flow

```
User requests prediction → GET /predictions/{symbol}?days=30
    ↓
Backend checks Redis cache
    ↓
If cached → Return cached predictions
    ↓
If not cached:
    1. Fetch 2 years historical data
    2. Train Prophet model
    3. Generate predictions
    4. Save to database
    5. Cache in Redis (24h)
    6. Return predictions
```

### Authentication Flow

```
User signs up → POST /auth/signup
    ↓
Backend validates email/password
    ↓
Hash password with bcrypt
    ↓
Create user in database
    ↓
Return user object
    ↓
Frontend stores JWT token
    ↓
All subsequent requests include: Authorization: Bearer {token}
```

---

## Authentication & Security

### JWT (JSON Web Tokens)

**Implementation**: `backend/app/dependencies.py`

**Token Structure**:
```json
{
  "sub": "user@email.com",
  "exp": 1234567890,
  "user_id": 1
}
```

**Token Expiry**: 24 hours (configurable)

**Storage**: 
- Frontend: Zustand store (memory)
- Not stored in localStorage (security best practice)

### Password Hashing

**Algorithm**: bcrypt with salt rounds = 12

**Process**:
1. User provides password
2. Backend hashes: `bcrypt.hashpw(password, bcrypt.gensalt())`
3. Store hash in database
4. On login: `bcrypt.checkpw(password, stored_hash)`

### API Security

- **CORS**: Configured for specific origins
- **Rate Limiting**: Handled by external APIs (yfinance, etc.)
- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection**: Prevented by SQLAlchemy ORM

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stock_symbol VARCHAR(20) NOT NULL,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Portfolio Table
```sql
CREATE TABLE portfolio (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stock_symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Predictions Table
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY,
    stock_symbol VARCHAR(20) NOT NULL,
    predicted_date DATE NOT NULL,
    predicted_price DECIMAL(10,2) NOT NULL,
    confidence DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Integration

### yfinance (Primary Data Source)

**Usage**: Fetch stock prices, historical data, company info

**Rate Limits**: ~2000 requests/hour (free tier)

**Caching**: 15 minutes for price data, 24 hours for historical

**Example**:
```python
import yfinance as yf
ticker = yf.Ticker("AAPL")
info = ticker.info  # Company info
hist = ticker.history(period="1mo")  # Historical data
```

### Finnhub (News & Additional Data)

**Usage**: Stock news, company profiles

**Rate Limits**: 60 calls/minute (free tier)

**Caching**: 1 hour

### ExchangeRate-API (Currency Conversion)

**Usage**: Real-time exchange rates

**Rate Limits**: 1500 requests/month (free tier)

**Caching**: 1 hour (rates change slowly)

---

## Caching Strategy

### Redis Cache (Upstash)

**Purpose**: Reduce API calls and improve response time

**Cache Keys**:
- `stock:{symbol}` → Stock info (15 min TTL)
- `history:{symbol}:{period}` → Historical data (15 min TTL)
- `prediction:{symbol}:{days}` → ML predictions (24 hour TTL)
- `currency:{from}:{to}` → Exchange rates (1 hour TTL)
- `news:{symbol}` → News articles (1 hour TTL)

**Fallback**: If Redis unavailable, app works without cache (slower)

**Implementation**: `backend/app/services/cache_service.py`

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx (Router)
├── Navbar (persistent)
├── Routes
│   ├── Home (landing page)
│   ├── Dashboard
│   ├── StockDetail
│   ├── Watchlist
│   ├── Portfolio
│   ├── Profile
│   └── Admin
└── Footer (persistent)
```

### Page Components

- **Home**: Landing page with features
- **Dashboard**: Market overview, portfolio summary, quick actions
- **StockDetail**: Stock info, charts, predictions, news
- **Watchlist**: User's watched stocks
- **Portfolio**: User's positions with P/L
- **Profile**: User settings
- **Admin**: User management (admin only)

### Reusable Components

- **StockCard**: Display stock info
- **StockChart**: Interactive price charts
- **PredictionView**: ML prediction visualization
- **PortfolioCard**: Portfolio position display
- **WatchlistItem**: Watchlist entry
- **StockSearch**: Search with autocomplete

---

## State Management

### Zustand Stores

**1. Auth Store** (`store/authStore.js`)
- `user`: Current user object
- `token`: JWT token
- `login()`, `logout()`, `signup()`

**2. Theme Store** (`store/themeStore.js`)
- `theme`: 'light' | 'dark'
- `toggleTheme()`

**3. Currency Store** (`store/currencyStore.js`)
- `currency`: Selected currency (USD, EUR, etc.)
- `setCurrency()`

### React Query

**Purpose**: Server state management

**Features**:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

**Example**:
```javascript
const { data, isLoading } = useQuery({
  queryKey: ['stock', symbol],
  queryFn: () => stockService.getStock(symbol),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## Key Algorithms & Logic

### Stock Search Algorithm

1. User types query
2. Frontend debounces (300ms delay)
3. Backend searches yfinance ticker list
4. Filters by symbol/name match
5. Returns top 10 results

### Portfolio Aggregation

```javascript
totalCost = portfolio.reduce((sum, item) => 
  sum + (item.quantity * item.purchase_price), 0
);

totalValue = portfolio.reduce((sum, item) => 
  sum + (item.quantity * item.current_price), 0
);

totalPL = totalValue - totalCost;
totalPLPercent = (totalPL / totalCost) * 100;
```

### Chart Data Processing

1. Fetch historical data from API
2. Transform to chart format:
   ```javascript
   {
     date: "2024-01-01",
     open: 180.00,
     high: 182.00,
     low: 179.00,
     close: 181.50,
     volume: 45000000
   }
   ```
3. Pass to ApexCharts component
4. Render interactive chart

---

## Performance Optimizations

1. **React Query Caching**: Reduces API calls
2. **Redis Caching**: Backend-level caching
3. **Code Splitting**: Lazy loading routes
4. **Debouncing**: Search input debounced
5. **Memoization**: React.memo for expensive components
6. **Image Optimization**: Lazy loading images

---

## Error Handling

### Frontend
- **Error Boundaries**: Catch React errors
- **Try-Catch**: API calls wrapped
- **User-Friendly Messages**: Display errors to users

### Backend
- **HTTP Status Codes**: Proper error responses
- **Exception Handling**: All endpoints wrapped
- **Logging**: Errors logged for debugging

---

## Future Enhancements (Not Implemented)

1. **Tax Calculations**: Currently only P/L, no tax logic
2. **Email Notifications**: Price alerts
3. **Social Features**: Share portfolios
4. **Advanced Charts**: Technical indicators (RSI, MACD)
5. **Mobile App**: React Native version
6. **Real-time Updates**: WebSocket for live prices

---

## Summary

This application demonstrates:
- **Full-stack development**: React + FastAPI
- **Machine Learning**: Prophet for predictions
- **Modern architecture**: Microservices-inspired
- **Production-ready**: Error handling, caching, security
- **Scalable design**: Can handle growth

**Key Technologies**:
- React 18, FastAPI, Prophet ML, Redis, MySQL/PostgreSQL
- Modern UI/UX with animations and responsive design
- RESTful API with JWT authentication
- Real-time stock data integration

---

**Last Updated**: January 2026  
**Version**: 1.0.0
