import yfinance as yf
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from app.services.cache_service import get_cache, set_cache
from app.database import SessionLocal
from app.models.prediction import Prediction


def predict_stock_price(symbol: str, days: int = 30) -> List[Dict]:
    cache_key = f"prediction:{symbol.upper()}:{days}"
    cached = get_cache(cache_key)
    if cached:
        return cached
    
    try:
        # Fetch 2 years of historical data
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period="2y")
        
        if hist.empty or len(hist) < 30:
            raise ValueError("Insufficient historical data")
        
        # Prepare data for Prophet - remove timezone from dates
        df = pd.DataFrame({
            'ds': hist.index.tz_localize(None) if hist.index.tz else hist.index,
            'y': hist['Close'].values
        })
        df.reset_index(drop=True, inplace=True)
        
        # Train Prophet model - suppress logging
        import logging
        import warnings
        warnings.filterwarnings('ignore')
        logging.getLogger('prophet').setLevel(logging.ERROR)
        logging.getLogger('cmdstanpy').setLevel(logging.ERROR)
        
        try:
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                changepoint_prior_scale=0.05
            )
        except AttributeError:
            # Workaround for stan_backend issue in Prophet 1.2.1
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                changepoint_prior_scale=0.05
            )
            # Manually set stan_backend to avoid the error
            if not hasattr(model, 'stan_backend'):
                model.stan_backend = None
        
        model.fit(df)
        
        # Make future predictions
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # Get predictions for future dates only
        predictions = []
        last_historical_date = df['ds'].max()
        
        for _, row in forecast.iterrows():
            if row['ds'] > last_historical_date:
                predictions.append({
                    "date": row['ds'].strftime("%Y-%m-%d"),
                    "predicted_price": float(row['yhat']),
                    "lower_bound": float(row['yhat_lower']),
                    "upper_bound": float(row['yhat_upper'])
                })
        
        # Save to database
        db = SessionLocal()
        try:
            # Delete old predictions for this symbol
            db.query(Prediction).filter(Prediction.stock_symbol == symbol.upper()).delete()
            
            # Save new predictions
            for pred in predictions[:days]:
                db_prediction = Prediction(
                    stock_symbol=symbol.upper(),
                    predicted_date=datetime.strptime(pred["date"], "%Y-%m-%d").date(),
                    predicted_price=pred["predicted_price"],
                    confidence=pred["upper_bound"] - pred["lower_bound"]
                )
                db.add(db_prediction)
            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
        
        set_cache(cache_key, predictions, ttl=86400)  # 24 hours
        return predictions
    except Exception as e:
        raise ValueError(f"Error generating prediction: {str(e)}")


def get_prediction_accuracy(symbol: str) -> Dict:
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period="1mo")
        
        if hist.empty:
            return {"accuracy": 0, "message": "Insufficient data"}
        
        # Get stored predictions
        db = SessionLocal()
        try:
            predictions = db.query(Prediction).filter(
                Prediction.stock_symbol == symbol.upper()
            ).all()
            
            if not predictions:
                return {"accuracy": 0, "message": "No predictions available"}
            
            # Compare with actual prices
            actual_prices = []
            predicted_prices = []
            
            for pred in predictions:
                pred_date = pred.predicted_date
                if pred_date in hist.index.date:
                    actual = hist.loc[hist.index.date == pred_date, 'Close'].values
                    if len(actual) > 0:
                        actual_prices.append(float(actual[0]))
                        predicted_prices.append(pred.predicted_price)
            
            if not actual_prices:
                return {"accuracy": 0, "message": "No matching dates found"}
            
            # Calculate accuracy (1 - MAPE)
            mape = sum(abs(a - p) / a for a, p in zip(actual_prices, predicted_prices)) / len(actual_prices)
            accuracy = max(0, (1 - mape) * 100)
            
            return {
                "accuracy": round(accuracy, 2),
                "mape": round(mape * 100, 2),
                "samples": len(actual_prices)
            }
        finally:
            db.close()
    except Exception:
        return {"accuracy": 0, "message": "Error calculating accuracy"}

