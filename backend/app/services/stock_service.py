import yfinance as yf
import requests
import os
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.services.cache_service import get_cache, set_cache
from app.config import settings
from app.schemas.stock import StockInfo, StockSearchResult, NewsItem
import time

# Circuit breaker for Yahoo Finance rate limiting
_yahoo_finance_blocked_until = None
_yahoo_finance_failure_count = 0
_last_successful_request = None


def _check_yahoo_finance_availability() -> bool:
    """Check if Yahoo Finance is available (circuit breaker)"""
    global _yahoo_finance_blocked_until, _yahoo_finance_failure_count, _last_successful_request
    
    # If we have a successful request recently, reset failure count
    if _last_successful_request:
        time_since_success = (datetime.now() - _last_successful_request).total_seconds()
        if time_since_success < 300:  # 5 minutes
            _yahoo_finance_failure_count = max(0, _yahoo_finance_failure_count - 1)  # Gradually reduce
            if _yahoo_finance_failure_count == 0:
                _yahoo_finance_blocked_until = None
    
    # If blocked, check if block period has passed
    if _yahoo_finance_blocked_until:
        if datetime.now() < _yahoo_finance_blocked_until:
            remaining = (_yahoo_finance_blocked_until - datetime.now()).total_seconds() / 60
            print(f"🚫 Yahoo Finance still blocked. Wait {remaining:.1f} more minutes.")
            return False  # Still blocked
        else:
            # Block period passed, reset
            print("✅ Yahoo Finance block period expired. Trying again...")
            _yahoo_finance_blocked_until = None
            _yahoo_finance_failure_count = 0
    
    return True


def _mark_yahoo_finance_failure():
    """Mark Yahoo Finance as failed and set block period"""
    global _yahoo_finance_blocked_until, _yahoo_finance_failure_count
    
    _yahoo_finance_failure_count += 1
    
    # Block for increasing periods: 15min, 30min, 45min, 60min (more aggressive)
    block_minutes = min(15 * _yahoo_finance_failure_count, 60)
    _yahoo_finance_blocked_until = datetime.now() + timedelta(minutes=block_minutes)
    remaining = (_yahoo_finance_blocked_until - datetime.now()).total_seconds() / 60
    print(f"⚠️ Yahoo Finance blocked for {block_minutes} minutes due to rate limiting (until {_yahoo_finance_blocked_until.strftime('%H:%M:%S')})")
    print(f"   Please wait {block_minutes} minutes before trying again.")


def _mark_yahoo_finance_success():
    """Mark Yahoo Finance as working"""
    global _yahoo_finance_failure_count, _last_successful_request, _yahoo_finance_blocked_until
    
    if _yahoo_finance_failure_count > 0:
        print(f"✅ Yahoo Finance is working again! (was blocked for {_yahoo_finance_failure_count} failures)")
    
    _yahoo_finance_failure_count = 0
    _yahoo_finance_blocked_until = None
    _last_successful_request = datetime.now()


def search_stocks(query: str) -> List[StockSearchResult]:
    cache_key = f"stock_search:{query.lower()}"
    cached = get_cache(cache_key)
    if cached:
        return [StockSearchResult(**item) for item in cached]
    
    results = []
    
    # Try Alpha Vantage search first (if API key available)
    if settings.ALPHA_VANTAGE_API_KEY:
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "SYMBOL_SEARCH",
                "keywords": query,
                "apikey": settings.ALPHA_VANTAGE_API_KEY
            }
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "bestMatches" in data and data["bestMatches"]:
                    for match in data["bestMatches"][:10]:  # Limit to 10 results
                        symbol = match.get("1. symbol", "")
                        region = match.get("4. region", "")
                        
                        # Skip .BSE symbols as they don't work with Yahoo Finance
                        if symbol and symbol.endswith('.BSE'):
                            # Try to find .NS or .BO alternative
                            base_symbol = symbol.replace('.BSE', '')
                            # Add alternative suggestions
                            if base_symbol:
                                # Check if we already have this base symbol
                                if not any(r.symbol == f"{base_symbol}.NS" or r.symbol == f"{base_symbol}.BO" for r in results):
                                    # Add .NS version (more common for Indian stocks)
                                    results.append(StockSearchResult(
                                        symbol=f"{base_symbol}.NS",
                                        name=match.get("2. name", "") + " (NSE - try this instead)",
                                        exchange="India/NSE"
                                    ))
                            continue  # Skip the .BSE version
                        
                        # Include other symbols
                        if symbol:
                            results.append(StockSearchResult(
                                symbol=symbol,
                                name=match.get("2. name", ""),
                                exchange=region
                            ))
        except Exception as e:
            print(f"Alpha Vantage search error: {e}")
    
    # Fallback: Try to validate the symbol directly with yfinance
    if not results:
        try:
            # If query looks like a symbol (uppercase, short), try to validate it
            if query.isupper() and len(query) <= 5:
                ticker = yf.Ticker(query.upper())
                info = ticker.info
                
                if info and 'symbol' in info:
                    results.append(StockSearchResult(
                        symbol=info.get('symbol', query.upper()),
                        name=info.get('longName', info.get('shortName', query.upper())),
                        exchange=info.get('exchange', '')
                    ))
        except Exception as e:
            print(f"yfinance validation error: {e}")
    
    # If still no results, try common stock symbols that match the query
    if not results:
        # Common stock symbols for quick testing
        common_stocks = {
            'aapl': ('AAPL', 'Apple Inc.'),
            'msft': ('MSFT', 'Microsoft Corporation'),
            'googl': ('GOOGL', 'Alphabet Inc.'),
            'tsla': ('TSLA', 'Tesla, Inc.'),
            'amzn': ('AMZN', 'Amazon.com, Inc.'),
            'meta': ('META', 'Meta Platforms, Inc.'),
            'nvda': ('NVDA', 'NVIDIA Corporation'),
            'jpm': ('JPM', 'JPMorgan Chase & Co.'),
            'v': ('V', 'Visa Inc.'),
            'wmt': ('WMT', 'Walmart Inc.')
        }
        
        query_lower = query.lower()
        for key, (symbol, name) in common_stocks.items():
            if query_lower in key or key in query_lower:
                try:
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    if info and 'symbol' in info:
                        results.append(StockSearchResult(
                            symbol=symbol,
                            name=name,
                            exchange=info.get('exchange', '')
                        ))
                        break
                except Exception:
                    pass
    
    if results:
        set_cache(cache_key, [r.model_dump() for r in results], ttl=3600)
    
    return results


def get_stock_info(symbol: str) -> StockInfo:
    # Check circuit breaker first
    if not _check_yahoo_finance_availability():
        raise ValueError(
            f"Yahoo Finance is temporarily unavailable due to rate limiting. "
            f"Please wait a few minutes and try again. This is a common issue with free API access."
        )
    
    cache_key = f"stock_info:{symbol.upper()}"
    cached = get_cache(cache_key)
    if cached:
        return StockInfo(**cached)
    
    # Handle exchange suffixes - try different formats for international stocks
    symbol_variants = [symbol.upper()]
    
    # If symbol has .BSE suffix, try .BO (Bombay Stock Exchange in yfinance)
    if '.BSE' in symbol.upper():
        base_symbol = symbol.upper().replace('.BSE', '')
        symbol_variants.extend([
            f"{base_symbol}.BO",  # BSE format
            f"{base_symbol}.NS",   # NSE format (more common)
            base_symbol            # Without suffix
        ])
    # If symbol has other exchange suffixes, try common alternatives
    elif '.' in symbol.upper():
        base_symbol = symbol.upper().split('.')[0]
        suffix = symbol.upper().split('.')[1]
        # Map common exchange suffixes
        exchange_map = {
            'BSE': ['.BO', '.NS', ''],
            'NSE': ['.NS', '.BO', ''],
            'LSE': ['.L', ''],
            'TSE': ['.T', ''],
            'ASX': ['.AX', '']
        }
        if suffix in exchange_map:
            symbol_variants.extend([f"{base_symbol}{s}" for s in exchange_map[suffix]])
        else:
            symbol_variants.append(base_symbol)
    
    # Retry logic with exponential backoff for rate limiting
    last_error = None
    rate_limited = False
    
    for attempt in range(5):  # Increased attempts to 5
        for variant in symbol_variants:
            try:
                # Add delay between requests to avoid rate limiting
                if attempt > 0:
                    delay = min(2 ** attempt, 10)  # Exponential backoff: 2s, 4s, 8s, 10s max
                    time.sleep(delay)
                
                ticker = yf.Ticker(variant)
                
                # Get current price from history - use shorter period first (more reliable)
                # Try multiple periods with timeout
                hist = None
                for period_try in ["5d", "1mo", "3mo", "1y"]:
                    try:
                        hist = ticker.history(period=period_try, timeout=30)
                        if not hist.empty and len(hist) > 0:
                            break
                    except Exception as e:
                        continue
                
                if hist is None or hist.empty:
                    continue  # Try next variant
                
                # Get the most recent data
                current_price = float(hist['Close'].iloc[-1])
                # Get previous close (from 2 days ago if available, or use current)
                if len(hist) > 1:
                    prev_close = float(hist['Close'].iloc[-2])
                else:
                    prev_close = current_price
                
                change = current_price - prev_close
                change_percent = (change / prev_close * 100) if prev_close > 0 else 0
                
                # Try to get additional info (may fail with rate limit)
                info = {}
                try:
                    # Add small delay before info request
                    time.sleep(0.5)
                    info = ticker.info
                except Exception:
                    # Info is optional, continue without it
                    pass
                
                # Use the original symbol for display, but variant worked
                stock_info = StockInfo(
                    symbol=symbol.upper(),  # Keep original symbol
                    name=info.get('longName', info.get('shortName', symbol.upper())),
                    current_price=current_price,
                    change=change,
                    change_percent=change_percent,
                    volume=int(hist['Volume'].iloc[-1]) if 'Volume' in hist.columns else None,
                    market_cap=info.get('marketCap') if info else None,
                    sector=info.get('sector') if info else None,
                    industry=info.get('industry') if info else None
                )
                
                set_cache(cache_key, stock_info.model_dump(), ttl=900)
                _mark_yahoo_finance_success()  # Mark as successful
                return stock_info
            except Exception as e:
                error_str = str(e)
                last_error = error_str
                
                # Check for rate limiting or API issues (including "Expecting value" which means empty response)
                if any(keyword in error_str for keyword in ["429", "Too Many Requests", "Expecting value", "rate limit", "No price data"]):
                    rate_limited = True
                    # Don't activate circuit breaker too quickly - might be temporary
                    if attempt >= 3:  # After 3 failed attempts
                        _mark_yahoo_finance_failure()
                        break  # Stop trying
                    # Continue to next variant or retry
                    continue
                
                # For other errors, try next variant
                continue
        
        # If rate limited and we've exhausted attempts, break
        if rate_limited and attempt >= 4:
            break
        
        # If all variants failed and not rate limited, wait before next attempt
        if attempt < 4 and not rate_limited:
            time.sleep(1)
    
    # If all attempts failed, provide helpful error message
    error_msg = f"Stock data not available for {symbol}."
    
    # Check if it's a rate limit issue
    if rate_limited or (last_error and any(keyword in last_error for keyword in ["429", "Too Many Requests", "Expecting value", "rate limit", "No price data"])):
        if _yahoo_finance_blocked_until:
            remaining_minutes = int((_yahoo_finance_blocked_until - datetime.now()).total_seconds() / 60) + 1
            error_msg += f" Yahoo Finance is currently rate-limited. **Please wait {remaining_minutes} minutes before trying again.** The system has automatically blocked requests to prevent further rate limiting."
        else:
            error_msg += " Yahoo Finance is currently rate-limited or experiencing API issues. This is common with free API access. **Please wait 15-30 minutes before trying again.** The service will automatically retry when the rate limit is lifted."
    elif ".BSE" in symbol.upper():
        error_msg += " Indian stocks with .BSE suffix are not supported by Yahoo Finance. Try searching for the stock with .NS (NSE) or .BO (BSE) suffix instead."
    elif ".BO" in symbol.upper() or ".NS" in symbol.upper():
        error_msg += " The symbol may be delisted or unavailable on Yahoo Finance. Try searching for the base symbol without the exchange suffix, or verify the symbol is correct."
    else:
        error_msg += " The symbol may be invalid, delisted, or Yahoo Finance may be temporarily unavailable. If this is a valid US stock (like AAPL, MSFT, TSLA), **please wait 3-5 minutes and try again** as Yahoo Finance may be rate-limiting requests."
    
    raise ValueError(error_msg)


def get_stock_history(symbol: str, period: str = "1mo") -> List[Dict[str, float]]:
    # Check circuit breaker first
    if not _check_yahoo_finance_availability():
        return []  # Return empty list instead of raising error for history
    
    cache_key = f"stock_history:{symbol.upper()}:{period}"
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    # Handle exchange suffixes similar to get_stock_info
    symbol_variants = [symbol.upper()]
    if '.BSE' in symbol.upper():
        base_symbol = symbol.upper().replace('.BSE', '')
        symbol_variants.extend([f"{base_symbol}.BO", f"{base_symbol}.NS", base_symbol])
    elif '.' in symbol.upper():
        base_symbol = symbol.upper().split('.')[0]
        symbol_variants.append(base_symbol)
    
    # Retry with exponential backoff
    for attempt in range(2):  # Reduced attempts for history
        for variant in symbol_variants:
            try:
                if attempt > 0:
                    time.sleep(min(2 ** attempt, 5))  # 2s, 5s delays
                
                ticker = yf.Ticker(variant)
                hist = ticker.history(period=period, timeout=30)
                
                if hist.empty or len(hist) == 0:
                    continue  # Try next variant
                
                data = []
                for date, row in hist.iterrows():
                    data.append({
                        "date": date.strftime("%Y-%m-%d"),
                        "open": float(row['Open']),
                        "high": float(row['High']),
                        "low": float(row['Low']),
                        "close": float(row['Close']),
                        "volume": int(row['Volume']) if 'Volume' in row else 0
                    })
                
                set_cache(cache_key, data, ttl=900)
                _mark_yahoo_finance_success()  # Mark as successful
                return data
            except Exception as e:
                # If rate limited, mark failure and stop
                if "429" in str(e) or "Too Many Requests" in str(e) or "Expecting value" in str(e):
                    if attempt >= 1:  # After 1 failed attempt for history
                        _mark_yahoo_finance_failure()
                        break
                    if attempt < 1:
                        time.sleep(min(2 ** (attempt + 2), 10))
                        break
                continue  # Try next variant
        
        if attempt < 1:
            time.sleep(1)
    
    # Return empty list if all attempts failed (don't raise error for history)
    return []


def get_real_time_price(symbol: str) -> float:
    cache_key = f"stock_price:{symbol.upper()}"
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    try:
        ticker = yf.Ticker(symbol.upper())
        data = ticker.history(period="1d")
        if not data.empty:
            price = float(data['Close'].iloc[-1])
            set_cache(cache_key, price, ttl=300)
            return price
    except Exception:
        pass
    
    return 0.0


def get_news(symbol: str, limit: int = 10) -> List[NewsItem]:
    cache_key = f"stock_news:{symbol.upper()}:{limit}"
    cached = get_cache(cache_key)
    if cached:
        return [NewsItem(**item) for item in cached]
    
    news_items = []
    original_symbol = symbol.upper()
    
    # For Indian stocks, try base symbol without exchange suffix
    base_symbol = original_symbol
    if '.NS' in original_symbol or '.BO' in original_symbol or '.BSE' in original_symbol:
        base_symbol = original_symbol.split('.')[0]
    
    # Try Finnhub API if key is available
    if settings.FINNHUB_API_KEY:
        # Try with original symbol first
        symbols_to_try = [original_symbol]
        if base_symbol != original_symbol:
            symbols_to_try.append(base_symbol)
        
        for sym in symbols_to_try:
            if news_items:
                break
            try:
                url = f"https://finnhub.io/api/v1/company-news"
                params = {
                    "symbol": sym,
                    "from": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),  # Increased to 30 days
                    "to": datetime.now().strftime("%Y-%m-%d"),
                    "token": settings.FINNHUB_API_KEY
                }
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list) and len(data) > 0:
                        for item in data[:limit]:
                            if item.get('headline') and item.get('url'):  # Only add valid news items
                                news_items.append(NewsItem(
                                    headline=item.get('headline', ''),
                                    summary=item.get('summary', '') or item.get('headline', ''),
                                    source=item.get('source', 'Unknown'),
                                    url=item.get('url', ''),
                                    datetime=datetime.fromtimestamp(item.get('datetime', 0)) if item.get('datetime') else datetime.now(),
                                    image=item.get('image', '')
                                ))
            except Exception as e:
                # Log error in development
                # Note: import.meta.env is for frontend, use a different check for backend
                import os
                if os.getenv('ENVIRONMENT', 'development') != 'production':
                    print(f"Finnhub news error for {sym}: {e}")
                continue
    
    # Fallback to yfinance news - try multiple symbol variations
    if not news_items:
        symbols_to_try = [original_symbol]
        if base_symbol != original_symbol:
            symbols_to_try.append(base_symbol)
        
        for sym in symbols_to_try:
            if news_items:
                break
            try:
                ticker = yf.Ticker(sym)
                news = ticker.news
                if news and len(news) > 0:
                    for item in news[:limit]:
                        if item.get('title') and item.get('link'):  # Only add valid news items
                            news_items.append(NewsItem(
                                headline=item.get('title', ''),
                                summary=item.get('summary', '') or item.get('title', ''),
                                source=item.get('publisher', 'Unknown'),
                                url=item.get('link', ''),
                                datetime=datetime.fromtimestamp(item.get('providerPublishTime', 0)) if item.get('providerPublishTime') else datetime.now(),
                                image=None
                            ))
            except Exception as e:
                # Log error in development
                # Note: import.meta.env is for frontend, use a different check for backend
                import os
                if os.getenv('ENVIRONMENT', 'development') != 'production':
                    print(f"yfinance news error for {sym}: {e}")
                continue
    
    # If still no news, try Alpha Vantage news search (if API key available)
    if not news_items and settings.ALPHA_VANTAGE_API_KEY:
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "NEWS_SENTIMENT",
                "tickers": base_symbol,
                "apikey": settings.ALPHA_VANTAGE_API_KEY,
                "limit": limit
            }
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'feed' in data and isinstance(data['feed'], list):
                    for item in data['feed'][:limit]:
                        if item.get('title') and item.get('url'):
                            news_items.append(NewsItem(
                                headline=item.get('title', ''),
                                summary=item.get('summary', '') or item.get('title', ''),
                                source=item.get('source', 'Unknown'),
                                url=item.get('url', ''),
                                datetime=datetime.fromisoformat(item.get('time_published', '').replace('T', ' ').split('+')[0]) if item.get('time_published') else datetime.now(),
                                image=item.get('banner_image', '')
                            ))
        except Exception as e:
            if os.getenv('ENVIRONMENT', 'development') != 'production':
                print(f"Alpha Vantage news error: {e}")
            pass
    
    if news_items:
        set_cache(cache_key, [item.model_dump() for item in news_items], ttl=3600)
    
    return news_items


def convert_currency(amount: float, from_currency: str, to_currency: str) -> Dict:
    # If same currency, no conversion needed
    if from_currency.upper() == to_currency.upper():
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": 1.0,
            "converted_amount": amount
        }
    
    cache_key = f"currency:{from_currency.upper()}:{to_currency.upper()}"
    cached = get_cache(cache_key)
    if cached:
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": cached["exchange_rate"],
            "converted_amount": amount * cached["exchange_rate"]
        }
    
    rate = 1.0  # Default rate
    
    try:
        # Try ExchangeRate API first
        if settings.EXCHANGE_RATE_API_KEY:
            try:
                url = f"https://v6.exchangerate-api.com/v6/{settings.EXCHANGE_RATE_API_KEY}/pair/{from_currency.upper()}/{to_currency.upper()}"
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('result') == 'success':
                        rate = data.get('conversion_rate', 1.0)
            except Exception as e:
                print(f"ExchangeRate API error: {e}")
        
        # Fallback: use yfinance for currency conversion if rate is still 1.0
        if rate == 1.0:
            try:
                ticker = yf.Ticker(f"{from_currency.upper()}{to_currency.upper()}=X")
                hist = ticker.history(period="5d", timeout=10)
                if hist is not None and not hist.empty and len(hist) > 0:
                    rate = float(hist['Close'].iloc[-1])
            except Exception as e:
                print(f"yfinance currency conversion error: {e}")
        
        # If still no rate, try common conversions
        if rate == 1.0:
            common_rates = {
                ('USD', 'INR'): 83.5,
                ('INR', 'USD'): 0.012,
                ('USD', 'EUR'): 0.92,
                ('EUR', 'USD'): 1.09,
                ('USD', 'GBP'): 0.79,
                ('GBP', 'USD'): 1.27,
            }
            rate = common_rates.get((from_currency.upper(), to_currency.upper()), 1.0)
        
        result = {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": rate,
            "converted_amount": amount * rate
        }
        
        # Cache the rate
        if rate != 1.0:
            set_cache(cache_key, {"exchange_rate": rate}, ttl=3600)
        
        return result
        
    except Exception as e:
        print(f"Currency conversion error: {e}")
        # Fallback with common rates
        common_rates = {
            ('USD', 'INR'): 83.5,
            ('INR', 'USD'): 0.012,
            ('USD', 'EUR'): 0.92,
            ('EUR', 'USD'): 1.09,
            ('USD', 'GBP'): 0.79,
            ('GBP', 'USD'): 1.27,
        }
        rate = common_rates.get((from_currency.upper(), to_currency.upper()), 1.0)
        
        return {
            "amount": amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "exchange_rate": rate,
            "converted_amount": amount * rate
        }

