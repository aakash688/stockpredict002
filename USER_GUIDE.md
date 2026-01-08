# 📖 Stock Analysis Platform - User Guide

Welcome to your Stock Analysis & Prediction Platform! This guide will help you make the most of all features.

## 🏠 Getting Started

### 1. Create an Account
1. Go to `http://localhost:5173/signup`
2. Enter your email, password, and full name
3. Click "Sign Up"
4. You'll be automatically logged in

### 2. First Login
1. Visit `http://localhost:5173/login`
2. Enter your credentials
3. Click "Login"
4. You'll be redirected to your dashboard

---

## 🎯 Main Features

### 📊 Dashboard
Your central hub for market overview and quick access.

**What You'll See:**
- Market indices (S&P 500, NASDAQ, Dow Jones)
- Your watchlist preview
- Quick stock search
- Quick actions

**How to Use:**
1. Use the search bar to find stocks
2. Click on watchlist items to view details
3. Access Portfolio and Watchlist from quick actions

---

### 🔍 Stock Search

**Where:** Available on every page in the navbar and dashboard

**How to Search:**
1. Click the search bar
2. Type a stock symbol (e.g., "AAPL") or company name (e.g., "Apple")
3. Results appear as you type
4. Click on a result to view stock details

**Tips:**
- Search is case-insensitive
- Works with partial names
- Shows company name and symbol

---

### 📈 Stock Detail Page

**What You'll Find:**
1. **Current Price** - Real-time stock price
2. **Price Change** - Today's change ($ and %)
3. **Interactive Chart** - Historical price visualization
4. **Predictions** - AI-powered future price predictions
5. **News** - Recent stock-specific news
6. **Company Info** - Market cap, sector, industry

**Chart Controls:**
- **Time Periods**: 1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y
- **Chart Type**: Line or Candlestick
- **Interactive**: Hover to see exact values
- **Zoom**: Click and drag to zoom in

**Understanding Predictions:**
- Blue line = Predicted prices
- Dashed lines = Confidence bounds (uncertainty range)
- Accuracy metrics = How well past predictions performed
- ⚠️ Disclaimer: Not financial advice!

---

### ⭐ Watchlist

**Purpose:** Track stocks you're interested in without owning them.

**How to Add Stocks:**
1. Go to `/watchlist`
2. Click "Add Stock"
3. Search and select a stock
4. Optionally add notes
5. Click "Add to Watchlist"

**OR** from Stock Detail page:
- Click "Add to Watchlist" button

**What You See:**
- Real-time prices
- Daily change ($ and %)
- Your personal notes
- Quick access to stock details

**How to Remove:**
- Hover over a watchlist item
- Click the X button
- Confirm removal

---

### 💼 Portfolio

**Purpose:** Track your actual investments and calculate profit/loss.

**How to Add Positions:**
1. Go to `/portfolio`
2. Click "Add Position"
3. Enter:
   - Stock Symbol (e.g., AAPL)
   - Quantity (e.g., 10)
   - Purchase Price (e.g., 150.00)
   - Purchase Date
4. Click "Add Position"

**What You See:**
- **Total Cost**: What you paid
- **Current Value**: What it's worth now
- **Total P/L**: Your profit or loss
  - Green = Profit
  - Red = Loss
- **Per-Stock Details**: Individual position performance

**How to Manage:**
- **Edit**: Click edit icon to update details
- **Delete**: Click trash icon to remove position

---

### 🌓 Dark Mode

**How to Toggle:**
1. Click the Sun/Moon icon in the navbar
2. Theme switches instantly
3. Preference is saved

**Features:**
- Optimized for both light and dark viewing
- Easy on the eyes for long sessions
- Professional color scheme

---

### 👨‍💼 Admin Panel

**Access:** Only available if you're an admin user

**How to Become Admin:**
1. Sign up normally
2. Update database to set `is_admin = true`
3. Refresh the page

**Admin Features:**

#### Users Tab
- View all registered users
- See user details (email, name, status)
- Activate/Deactivate users
- View user creation dates

#### Statistics Tab
- Total users count
- Active users count
- Total watchlists
- Total portfolios
- System health metrics

**Admin Actions:**
- **Deactivate User**: Prevents login (doesn't delete account)
- **Activate User**: Re-enables login access

---

## 🎨 UI Components

### Navigation Bar
- **Logo**: Click to go home
- **Home**: Landing page
- **Dashboard**: Your dashboard (logged in)
- **Watchlist**: Your watchlist (logged in)
- **Portfolio**: Your portfolio (logged in)
- **Admin**: Admin panel (admin only)
- **Theme Toggle**: Switch dark/light mode
- **User Menu**: Profile and logout

### Stock Cards
- **Symbol**: Stock ticker
- **Name**: Company name
- **Price**: Current price
- **Change**: Daily change with color coding
- **Trend Icon**: Up/down arrow

---

## 💡 Pro Tips

### For Better Experience
1. **Add to Watchlist First** - Before buying, watch stocks
2. **Check Multiple Periods** - View 1M, 3M, 1Y charts
3. **Read Predictions Carefully** - Use as one of many tools
4. **Track Portfolio Regularly** - Update when you buy/sell
5. **Use Dark Mode** - Easier on eyes during trading hours

### Stock Research Workflow
1. **Search** - Find the stock
2. **Analyze Charts** - Check historical trends
3. **Read News** - Stay informed
4. **Check Predictions** - See AI forecast
5. **Add to Watchlist** - Monitor over time
6. **Make Decision** - When ready, add to portfolio

### Portfolio Management
1. **Enter All Positions** - Accurate tracking
2. **Include Purchase Date** - See time-based performance
3. **Update Regularly** - When you buy/sell
4. **Review P/L** - Understand your performance

---

## 🔧 Troubleshooting

### Can't Login?
- Check email and password
- Password must be 8+ chars with uppercase, lowercase, and number
- Clear browser cache if issues persist

### Stock Not Found?
- Verify the symbol (e.g., "AAPL" not "Apple")
- Try searching by company name
- US stocks are primarily supported

### Predictions Not Loading?
- Predictions take 5-10 seconds to generate
- Requires 2+ years of historical data
- Some stocks may not have enough data

### Chart Not Showing?
- Try changing the time period
- Some periods may have insufficient data
- Refresh the page

---

## 🌐 Supported Stocks

### Exchanges
- **NASDAQ** - Tech stocks (AAPL, TSLA, MSFT)
- **NYSE** - Traditional companies
- **Major US Stocks** - S&P 500 companies

### Popular Symbols
- **Technology**: AAPL, MSFT, GOOGL, META, NVDA, TSLA
- **Finance**: JPM, BAC, WFC, GS
- **Healthcare**: JNJ, UNH, PFE, ABBV
- **Consumer**: AMZN, WMT, HD, NKE
- **Energy**: XOM, CVX, COP

---

## 📱 Mobile Use

The platform is fully responsive:
- Works on phones and tablets
- Touch-friendly charts
- Mobile-optimized navigation
- Swipe gestures supported

---

## ⚠️ Important Disclaimers

### Investment Disclaimer
- **Not Financial Advice** - For educational purposes only
- **Do Your Research** - Don't rely solely on predictions
- **Past Performance ≠ Future Results**
- **Consult Professionals** - Talk to financial advisors

### Data Accuracy
- Prices may be delayed up to 15 minutes
- Predictions are statistical models, not guarantees
- News is from third-party sources
- Always verify critical information

---

## 🎓 Understanding Predictions

### How It Works
1. Collects 2 years of historical data
2. Uses Facebook Prophet ML model
3. Analyzes trends and patterns
4. Generates future price forecasts

### Reading Predictions
- **Predicted Price**: Most likely price
- **Confidence Bounds**: Range of possible prices
  - Wide bounds = More uncertainty
  - Narrow bounds = More confidence
- **Accuracy Score**: How well past predictions performed

### When to Trust Predictions
- Higher accuracy scores (>70%)
- Narrow confidence bounds
- Stable stock history
- Confirmed by other indicators

### When to Be Cautious
- Low accuracy scores (<50%)
- Very wide confidence bounds
- Volatile stocks
- Major news/events pending

---

## 📞 Support

### Common Questions

**Q: How often does data update?**
A: Real-time prices update every 5 minutes (cached)

**Q: Can I export my portfolio?**
A: Currently manual export. Coming soon: CSV/PDF export

**Q: Is my data secure?**
A: Yes. Passwords are hashed, JWTs for authentication

**Q: What happens if I forget my password?**
A: Currently no reset. Contact admin or create new account

---

## 🚀 Future Features

Coming soon:
- Price alerts
- Email notifications
- Stock comparison tool
- Advanced technical indicators
- Social features
- Mobile app
- Export reports

---

**Happy Trading! 📈✨**

Remember: This is an educational platform. Always do your own research and consult financial professionals before making investment decisions.

