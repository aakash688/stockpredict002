from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
from app.schemas.prediction import PredictionResponse, PredictionAccuracy
from app.services.prediction_service import predict_stock_price, get_prediction_accuracy

router = APIRouter()


@router.get("/{symbol}", response_model=List[PredictionResponse])
async def get_predictions(
    symbol: str,
    days: int = Query(30, ge=7, le=90)
):
    try:
        predictions = predict_stock_price(symbol.upper(), days)
        return [
            PredictionResponse(
                date=pred["date"],
                predicted_price=pred["predicted_price"],
                lower_bound=pred["lower_bound"],
                upper_bound=pred["upper_bound"]
            )
            for pred in predictions
        ]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}/accuracy", response_model=PredictionAccuracy)
async def get_accuracy(symbol: str):
    try:
        accuracy_data = get_prediction_accuracy(symbol.upper())
        return PredictionAccuracy(**accuracy_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

