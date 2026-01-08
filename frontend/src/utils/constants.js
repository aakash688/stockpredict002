export const CHART_PERIODS = [
  { label: '1D', value: '1d' },
  { label: '5D', value: '5d' },
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: '2Y', value: '2y' },
  { label: '5Y', value: '5y' },
]

export const PREDICTION_DAYS = [7, 14, 30, 60, 90]

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF', 'HKD'
]

export const MAJOR_INDICES = [
  // US Indices
  { symbol: '^GSPC', name: 'S&P 500', country: 'US', currency: 'USD' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', country: 'US', currency: 'USD' },
  { symbol: '^DJI', name: 'Dow Jones', country: 'US', currency: 'USD' },
  // Indian Indices
  { symbol: '^NSEI', name: 'Nifty 50', country: 'IN', currency: 'INR' },
  { symbol: '^NSEBANK', name: 'Bank Nifty', country: 'IN', currency: 'INR' },
  { symbol: '^BSESN', name: 'Sensex', country: 'IN', currency: 'INR' },
]

// Popular stocks for top movers sections
export const POPULAR_US_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'
]

export const POPULAR_INDIAN_STOCKS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS', 
  'ICICIBANK.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS', 'LT.NS'
]

