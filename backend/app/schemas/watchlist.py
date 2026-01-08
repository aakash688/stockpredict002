from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class WatchlistCreate(BaseModel):
    stock_symbol: str
    notes: Optional[str] = None


class WatchlistResponse(BaseModel):
    id: int
    stock_symbol: str
    added_at: datetime
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True


class WatchlistItem(BaseModel):
    id: int
    stock_symbol: str
    added_at: datetime
    notes: Optional[str] = None
    current_price: Optional[float] = None
    change: Optional[float] = None
    change_percent: Optional[float] = None

