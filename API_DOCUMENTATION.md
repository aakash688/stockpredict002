# 📚 Stock Analysis Platform - API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: (Your deployed backend URL)

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-01-05T12:00:00Z"
}
```

---

### Login
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-01-05T12:00:00Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response:** `200 OK` - Updated user object

---

## 📈 Stock Endpoints

### Search Stocks
**GET** `/stocks/search?q={query}`

Search for stocks by symbol or name.

**Query Parameters:**
- `q` (required): Search query (e.g., "AAPL", "Apple")

**Response:** `200 OK`
```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "exchange": "NASDAQ"
  }
]
```

---

### Get Stock Info
**GET** `/stocks/{symbol}`

Get detailed information about a stock.

**Parameters:**
- `symbol` (path): Stock symbol (e.g., "AAPL")

**Response:** `200 OK`
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "current_price": 185.50,
  "change": 2.30,
  "change_percent": 1.25,
  "volume": 50000000,
  "market_cap": 2850000000000,
  "sector": "Technology",
  "industry": "Consumer Electronics"
}
```

---

### Get Stock History
**GET** `/stocks/{symbol}/history?period={period}`

Get historical price data.

**Parameters:**
- `symbol` (path): Stock symbol
- `period` (query): Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y)

**Response:** `200 OK`
```json
{
  "symbol": "AAPL",
  "period": "1mo",
  "data": [
    {
      "date": "2024-01-01",
      "open": 180.00,
      "high": 182.00,
      "low": 179.00,
      "close": 181.50,
      "volume": 45000000
    }
  ]
}
```

---

### Get Stock News
**GET** `/stocks/{symbol}/news?limit={limit}`

Get recent news for a stock.

**Parameters:**
- `symbol` (path): Stock symbol
- `limit` (query): Number of news items (1-50, default: 10)

**Response:** `200 OK`
```json
[
  {
    "headline": "Apple announces new product",
    "summary": "Apple Inc. unveiled...",
    "source": "Reuters",
    "url": "https://...",
    "datetime": "2024-01-05T10:00:00Z",
    "image": "https://..."
  }
]
```

---

### Currency Conversion
**POST** `/stocks/convert?amount={amount}&from_currency={from}&to_currency={to}`

Convert stock prices between currencies.

**Query Parameters:**
- `amount`: Amount to convert
- `from_currency`: Source currency code (e.g., "USD")
- `to_currency`: Target currency code (e.g., "EUR")

**Response:** `200 OK`
```json
{
  "amount": 100.0,
  "from_currency": "USD",
  "to_currency": "EUR",
  "exchange_rate": 0.92,
  "converted_amount": 92.0
}
```

---

## 📋 Watchlist Endpoints

### Get Watchlist
**GET** `/watchlist`

Get user's watchlist with live prices.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "stock_symbol": "AAPL",
    "added_at": "2024-01-05T12:00:00Z",
    "notes": "Watching for entry point",
    "current_price": 185.50,
    "change": 2.30,
    "change_percent": 1.25
  }
]
```

---

### Add to Watchlist
**POST** `/watchlist`

Add a stock to watchlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "stock_symbol": "AAPL",
  "notes": "Watching for entry point"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "stock_symbol": "AAPL",
  "added_at": "2024-01-05T12:00:00Z",
  "notes": "Watching for entry point"
}
```

---

### Remove from Watchlist
**DELETE** `/watchlist/{item_id}`

Remove a stock from watchlist.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `item_id` (path): Watchlist item ID

**Response:** `204 No Content`

---

## 💼 Portfolio Endpoints

### Get Portfolio
**GET** `/portfolio`

Get user's portfolio with P/L calculations.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "stock_symbol": "AAPL",
    "quantity": 10,
    "purchase_price": 150.00,
    "purchase_date": "2023-12-01",
    "current_price": 185.50,
    "total_cost": 1500.00,
    "current_value": 1855.00,
    "profit_loss": 355.00,
    "profit_loss_percent": 23.67
  }
]
```

---

### Add to Portfolio
**POST** `/portfolio`

Add a position to portfolio.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "stock_symbol": "AAPL",
  "quantity": 10,
  "purchase_price": 150.00,
  "purchase_date": "2023-12-01"
}
```

**Response:** `201 Created` - Portfolio item object

---

### Update Portfolio
**PUT** `/portfolio/{item_id}`

Update a portfolio position.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `item_id` (path): Portfolio item ID

**Request Body:** Same as Add to Portfolio

**Response:** `200 OK` - Updated portfolio item

---

### Remove from Portfolio
**DELETE** `/portfolio/{item_id}`

Remove a position from portfolio.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `item_id` (path): Portfolio item ID

**Response:** `204 No Content`

---

## 🔮 Prediction Endpoints

### Get Predictions
**GET** `/predictions/{symbol}?days={days}`

Get AI-powered price predictions.

**Parameters:**
- `symbol` (path): Stock symbol
- `days` (query): Number of days to predict (7-90, default: 30)

**Response:** `200 OK`
```json
[
  {
    "date": "2024-01-06",
    "predicted_price": 187.25,
    "lower_bound": 180.00,
    "upper_bound": 194.50
  }
]
```

---

### Get Prediction Accuracy
**GET** `/predictions/{symbol}/accuracy`

Get accuracy metrics for past predictions.

**Parameters:**
- `symbol` (path): Stock symbol

**Response:** `200 OK`
```json
{
  "accuracy": 85.5,
  "mape": 14.5,
  "samples": 25,
  "message": null
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require admin privileges.

### Get All Users
**GET** `/admin/users?skip={skip}&limit={limit}`

Get list of all users.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `skip` (optional): Offset (default: 0)
- `limit` (optional): Limit (default: 100)

**Response:** `200 OK` - Array of user objects

---

### Get System Statistics
**GET** `/admin/stats`

Get system statistics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "total_users": 150,
  "active_users": 145,
  "total_watchlists": 523,
  "total_portfolios": 298
}
```

---

### Update User Status
**PUT** `/admin/users/{user_id}/status`

Update user status (activate/deactivate, promote/demote).

**Headers:** `Authorization: Bearer <admin_token>`

**Parameters:**
- `user_id` (path): User ID

**Request Body:**
```json
{
  "is_active": true,
  "is_admin": false
}
```

**Response:** `200 OK` - Updated user object

---

## 🚨 Error Responses

All endpoints may return these error codes:

- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## 📝 Notes

- All timestamps are in UTC
- Stock symbols are case-insensitive (converted to uppercase)
- Prices are in USD unless converted
- Predictions use Prophet machine learning model
- Data is cached for 5-15 minutes
- Rate limits apply to external APIs

---

## 🔍 Testing with cURL

**Login Example:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```

**Get Stock Info:**
```bash
curl "http://localhost:8000/stocks/AAPL"
```

**Get Watchlist (Authenticated):**
```bash
curl "http://localhost:8000/watchlist" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

For interactive API testing, use the Swagger UI at: **http://localhost:8000/docs**

