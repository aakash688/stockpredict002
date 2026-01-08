"""Test connection with raw password (no encoding)"""
from sqlalchemy import create_engine, text
import urllib.parse

# Try with raw password (might need to escape in connection string)
password_raw = "Anmol$#STock123"

# Try different approaches
test_configs = [
    {
        "name": "URL encoded (current)",
        "password": "Anmol%24%23STock123"
    },
    {
        "name": "Double URL encoded",
        "password": urllib.parse.quote("Anmol%24%23STock123")
    },
    {
        "name": "Raw password (might fail)",
        "password": password_raw
    }
]

host = "82.180.143.154"
user = "u215122914_anmolstock"
database = "u215122914_anmolstock"

print("Testing MySQL connection with different password formats...")
print("="*60)

for config in test_configs:
    try:
        # Build connection string
        conn_str = f"mysql+pymysql://{user}:{config['password']}@{host}:3306/{database}?charset=utf8mb4"
        
        print(f"\nTrying: {config['name']}")
        print(f"Password format: {config['password'][:20]}...")
        
        engine = create_engine(
            conn_str,
            pool_pre_ping=True,
            connect_args={"charset": "utf8mb4", "connect_timeout": 10}
        )
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test, DATABASE() as db"))
            row = result.fetchone()
            print(f"[SUCCESS] Connected! Test: {row[0]}, Database: {row[1]}")
            print(f"\n✅ Use this in your .env file:")
            print(f'DATABASE_URL="{conn_str}"')
            break
            
    except Exception as e:
        error_msg = str(e)
        if "Access denied" in error_msg:
            print(f"[FAILED] Access denied - password or permissions issue")
        else:
            print(f"[FAILED] {error_msg[:100]}")

print("\n" + "="*60)
print("If all methods fail, the issue is likely:")
print("1. Wrong password")
print("2. User doesn't have remote access permissions")
print("3. MySQL server doesn't allow remote connections")
print("4. Firewall blocking the connection")
print("\nSee FIX_MYSQL_ACCESS.md for detailed solutions")

