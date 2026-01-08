from pydantic import BaseModel
from datetime import date
from typing import Optional


class PortfolioCreate(BaseModel):
    stock_symbol: str
    quantity: float
    purchase_price: float
    purchase_date: date


class PortfolioResponse(BaseModel):
    id: int
    stock_symbol: str
    quantity: float
    purchase_price: float
    purchase_date: date
    
    class Config:
        from_attributes = True


class PortfolioItem(BaseModel):
    id: int
    stock_symbol: str
    quantity: float
    purchase_price: float
    purchase_date: date
    current_price: Optional[float] = None
    total_cost: Optional[float] = None
    current_value: Optional[float] = None
    profit_loss: Optional[float] = None
    profit_loss_percent: Optional[float] = None

