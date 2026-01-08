from pydantic import BaseModel
from typing import Optional


class PredictionResponse(BaseModel):
    date: str
    predicted_price: float
    lower_bound: float
    upper_bound: float


class PredictionAccuracy(BaseModel):
    accuracy: float
    mape: Optional[float] = None
    samples: Optional[int] = None
    message: Optional[str] = None

