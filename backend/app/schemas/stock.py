from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime


class StockInfo(BaseModel):
    symbol: str
    name: str
    current_price: float
    change: float
    change_percent: float
    volume: Optional[int] = None
    market_cap: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None


class StockHistory(BaseModel):
    symbol: str
    period: str
    data: List[Dict]  # Changed from Dict[str, float] to Dict to allow string dates


class StockSearchResult(BaseModel):
    symbol: str
    name: str
    exchange: Optional[str] = None


class CurrencyConversion(BaseModel):
    amount: float
    from_currency: str
    to_currency: str
    converted_amount: float
    exchange_rate: float


class NewsItem(BaseModel):
    headline: str
    summary: Optional[str] = None
    source: str
    url: str
    datetime: datetime
    image: Optional[str] = None

