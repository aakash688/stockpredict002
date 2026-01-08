"""Test MySQL connection"""
import os
import sys

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from sqlalchemy import create_engine, text
except ImportError:
    print("❌ SQLAlchemy not installed. Install with: pip install sqlalchemy")
    sys.exit(1)

# Try to load from app.config first (if available)
try:
    from app.config import settings
    database_url = settings.DATABASE_URL
    print("[OK] Loaded DATABASE_URL from app.config")
except Exception:
    # Fallback to dotenv
    try:
        from dotenv import load_dotenv
        load_dotenv()
        database_url = os.getenv('DATABASE_URL', '')
        print("[OK] Loaded DATABASE_URL from .env file")
    except ImportError:
        print("❌ python-dotenv not installed. Install with: pip install python-dotenv")
        sys.exit(1)

if not database_url:
    print("[ERROR] DATABASE_URL not found in environment variables or .env file")
    sys.exit(1)

# Remove quotes if present
if database_url.startswith('"') and database_url.endswith('"'):
    database_url = database_url[1:-1]
elif database_url.startswith("'") and database_url.endswith("'"):
    database_url = database_url[1:-1]

print(f"Testing connection to: {database_url.split('@')[0]}@...")

# Ensure MySQL format
if database_url.startswith('mysql://'):
    database_url = database_url.replace('mysql://', 'mysql+pymysql://')

if '?charset=' not in database_url and database_url.startswith('mysql'):
    if '?' not in database_url:
        database_url += '?charset=utf8mb4'
    else:
        database_url += '&charset=utf8mb4'

try:
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        connect_args={"charset": "utf8mb4"} if database_url.startswith('mysql') else {}
    )
    
    print("[OK] Engine created successfully")
    
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1 as test"))
        row = result.fetchone()
        print(f"[OK] Connection test successful: {row[0]}")
        
        # Test database exists
        result = conn.execute(text("SELECT DATABASE()"))
        db_name = result.fetchone()[0]
        print(f"[OK] Connected to database: {db_name}")
        
        # List existing tables
        result = conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.fetchall()]
        print(f"[OK] Existing tables: {tables if tables else 'None'}")
        
    print("\n[SUCCESS] MySQL connection is working correctly!")
    
except Exception as e:
    print(f"\n[ERROR] Connection failed: {e}")
    import traceback
    traceback.print_exc()

