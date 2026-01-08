from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import urllib.parse

# Parse database URL and handle MySQL
database_url = settings.DATABASE_URL

# Remove quotes if present (from .env file)
if database_url.startswith('"') and database_url.endswith('"'):
    database_url = database_url[1:-1]
elif database_url.startswith("'") and database_url.endswith("'"):
    database_url = database_url[1:-1]

# If MySQL URL, ensure proper format
if database_url.startswith('mysql://') or database_url.startswith('mysql+pymysql://'):
    # MySQL connection string format: mysql+pymysql://user:password@host:port/database
    if not database_url.startswith('mysql+pymysql://'):
        database_url = database_url.replace('mysql://', 'mysql+pymysql://')
    
    # Add charset and other MySQL-specific parameters
    if '?' not in database_url:
        database_url += '?charset=utf8mb4'
    elif 'charset=' not in database_url:
        database_url += '&charset=utf8mb4'

# Create engine with connection pooling for production
try:
    # For MySQL, add connect_args
    connect_args = {}
    if database_url.startswith('mysql'):
        connect_args = {
            "charset": "utf8mb4",
            "connect_timeout": 10
        }
    
    engine = create_engine(
        database_url,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=3600,   # Recycle connections after 1 hour
        echo=False,  # Set to True for SQL query logging in development
        connect_args=connect_args
    )
    print(f"✓ Database engine created for: {database_url.split('@')[1] if '@' in database_url else 'database'}")
except Exception as e:
    print(f"✗ Error creating database engine: {e}")
    print(f"✗ Database URL format: {database_url[:60]}...")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

