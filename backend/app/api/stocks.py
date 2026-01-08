from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.schemas.stock import StockInfo, StockSearchResult, StockHistory, CurrencyConversion, NewsItem
from app.services.stock_service import (
    search_stocks,
    get_stock_info,
    get_stock_history,
    get_news,
    convert_currency
)

router = APIRouter()


@router.get("/search", response_model=List[StockSearchResult])
async def search_stocks_endpoint(q: str = Query(..., min_length=1)):
    try:
        results = search_stocks(q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}", response_model=StockInfo)
async def get_stock(symbol: str):
    try:
        stock_info = get_stock_info(symbol.upper())
        return stock_info
    except ValueError as e:
        # Check if it's a rate limit error
        error_msg = str(e)
        if "rate limiting" in error_msg.lower() or "temporarily unavailable" in error_msg.lower():
            raise HTTPException(status_code=503, detail=error_msg)  # Service Unavailable
        raise HTTPException(status_code=404, detail=error_msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/history", response_model=StockHistory)
async def get_history(
    symbol: str,
    period: str = Query("1mo", regex="^(1d|5d|1mo|3mo|6mo|1y|2y|5y)$")
):
    try:
        data = get_stock_history(symbol.upper(), period)
        return StockHistory(symbol=symbol.upper(), period=period, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/news", response_model=List[NewsItem])
async def get_stock_news(symbol: str, limit: int = Query(10, ge=1, le=50)):
    try:
        news = get_news(symbol.upper(), limit)
        return news
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/convert", response_model=CurrencyConversion)
async def convert_currency_endpoint(
    amount: float = Query(..., gt=0),
    from_currency: str = Query(..., min_length=3, max_length=3),
    to_currency: str = Query(..., min_length=3, max_length=3)
):
    try:
        result = convert_currency(amount, from_currency.upper(), to_currency.upper())
        return CurrencyConversion(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

