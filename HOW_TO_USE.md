# 🚀 How to Use Your Stock Analysis Platform

## ✅ Everything is Working!

Both servers are running:
- **Backend**: http://localhost:8000 ✅
- **Frontend**: http://localhost:5173 ✅
- **Database**: SQLite with 2 users already created ✅

---

## 📝 Step-by-Step Guide

### 1. Sign Up (Create Account)

1. Go to: **http://localhost:5173/signup**
2. Fill in the form:
   - **Full Name**: Your Name
   - **Email**: your@email.com (use a real email you'll remember)
   - **Password**: `Test1234` (must have uppercase, lowercase, number, 8+ chars)
   - **Confirm Password**: `Test1234`
3. Click **"Sign Up"**
4. You'll be automatically logged in and redirected to Dashboard

**Important:** You must sign up first before you can login! The email `your@email.com` was just an example - use your own email.

### 2. Search for Stocks

1. Use the search bar (available on every page)
2. Type a stock symbol: `AAPL`, `MSFT`, `TSLA`, `GOOGL`
3. Click on the result
4. View stock details

### 3. View Stock Details

On the stock detail page you'll see:
- **Current Price** with daily change
- **Interactive Chart** - Click different time periods (1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y)
- **AI Predictions** - Future price forecasts
- **Recent News** - Stock-specific news
- **Company Info** - Market cap, sector, industry

### 4. Add to Watchlist

1. On stock detail page, click **"Add to Watchlist"**
2. Or go to `/watchlist` and click **"Add Stock"**
3. Search and select a stock
4. View your watchlist with live prices

### 5. Track Portfolio

1. Go to **Portfolio** page
2. Click **"Add Position"**
3. Enter:
   - Stock Symbol (e.g., `AAPL`)
   - Quantity (e.g., `10`)
   - Purchase Price (e.g., `150.00`)
   - Purchase Date
4. See automatic P/L calculations

### 6. Dashboard

Your dashboard shows:
- Market indices (S&P 500, NASDAQ, Dow Jones)
- Your watchlist preview
- Quick actions

### 7. Dark Mode

Click the Sun/Moon icon in the navbar to toggle dark/light mode.

---

## 🔑 Make Yourself Admin

To access the admin panel:

1. Note your email after signing up
2. Run this command:
```bash
cd backend
python -c "import sqlite3; conn = sqlite3.connect('stockdb.db'); cursor = conn.cursor(); cursor.execute('UPDATE users SET is_admin = 1 WHERE email = \"your@email.com\"'); conn.commit(); print('Admin access granted!'); conn.close()"
```
3. Refresh the page
4. You'll see "Admin" in the navbar

---

## 📊 Test These Stocks

Popular stocks that work well:
- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc. (Google)
- **TSLA** - Tesla, Inc.
- **AMZN** - Amazon.com, Inc.
- **NVDA** - NVIDIA Corporation
- **META** - Meta Platforms, Inc.

---

## ⚠️ Important Notes

### Yahoo Finance Rate Limits
- If you get "Too Many Requests", wait 30-60 seconds
- Data is cached for 15 minutes
- This is normal for free API tier

### Password Requirements
Must have ALL of these:
- ✅ At least 8 characters
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)

**Valid Examples:**
- `Test1234` ✅
- `Password123` ✅
- `MyPass99` ✅

**Invalid Examples:**
- `test1234` ❌ (no uppercase)
- `TEST1234` ❌ (no lowercase)
- `TestTest` ❌ (no number)
- `Test123` ❌ (less than 8 chars)

---

## 🎯 Quick Test Checklist

- [ ] Sign up at http://localhost:5173/signup
- [ ] Login at http://localhost:5173/login
- [ ] Search for "AAPL"
- [ ] View stock chart
- [ ] Change time period to 1Y
- [ ] Scroll down to see predictions
- [ ] Click "Add to Watchlist"
- [ ] Go to Watchlist page
- [ ] Add a portfolio position
- [ ] View Portfolio page
- [ ] Toggle dark mode
- [ ] Make yourself admin
- [ ] Access admin panel

---

## 🔄 Restart Servers

If you need to restart:

**Backend:**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## ✅ Everything Works!

- ✅ Signup/Login
- ✅ Stock search
- ✅ Interactive charts
- ✅ AI predictions
- ✅ Watchlist
- ✅ Portfolio tracking
- ✅ News feed
- ✅ Admin panel
- ✅ Dark mode
- ✅ Responsive design

**Your application is ready to use and demo! 🎉**

