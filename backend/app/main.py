from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api import auth, stocks, watchlist, portfolio, predictions, admin

# Import all models to ensure they're registered with Base
from app.models import User, Watchlist, Portfolio, Prediction

# Create database tables (with error handling)
def create_tables():
    try:
        from sqlalchemy import text
        
        # Test connection first
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        print("✓ Database connection successful!")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"✗ Error creating database tables: {e}")
        print(f"✗ Database URL (masked): {settings.DATABASE_URL.split('@')[0] if '@' in settings.DATABASE_URL else settings.DATABASE_URL[:50]}@...")
        print("✗ Database operations may fail. Check your DATABASE_URL and MySQL connection.")
        import traceback
        traceback.print_exc()
        return False

# Create tables on startup
create_tables()

app = FastAPI(
    title="Stock Analysis & Prediction API",
    description="Backend API for stock analysis and prediction platform",
    version="1.0.0"
)

# CORS middleware
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(watchlist.router, prefix="/watchlist", tags=["Watchlist"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])


@app.get("/")
async def root():
    return {"message": "Stock Analysis & Prediction API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

