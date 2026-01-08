# Stock Analysis & Prediction API - Backend

FastAPI backend for the Stock Analysis & Prediction Platform.

## Features

- User authentication (JWT)
- Stock data integration (yfinance, Finnhub)
- Stock price predictions using Prophet
- Watchlist management
- Portfolio tracking
- Admin panel
- Redis caching
- PostgreSQL database

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
- Database URL
- Redis URL (optional)
- JWT secret key
- API keys (optional)

### Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

See `.env.example` for all required environment variables.

## Database Setup

The database tables are created automatically on first run. For production, use migrations.

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### Stocks
- `GET /stocks/search?q={query}` - Search stocks
- `GET /stocks/{symbol}` - Get stock info
- `GET /stocks/{symbol}/history?period={period}` - Get historical data
- `GET /stocks/{symbol}/news` - Get stock news
- `POST /stocks/convert` - Currency conversion

### Watchlist
- `GET /watchlist` - Get user's watchlist
- `POST /watchlist` - Add to watchlist
- `DELETE /watchlist/{id}` - Remove from watchlist

### Portfolio
- `GET /portfolio` - Get user's portfolio
- `POST /portfolio` - Add position
- `PUT /portfolio/{id}` - Update position
- `DELETE /portfolio/{id}` - Remove position

### Predictions
- `GET /predictions/{symbol}?days={days}` - Get predictions
- `GET /predictions/{symbol}/accuracy` - Get prediction accuracy

### Admin
- `GET /admin/users` - List all users
- `GET /admin/stats` - System statistics
- `PUT /admin/users/{id}/status` - Update user status

## License

MIT

