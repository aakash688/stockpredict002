"""Test different password encoding methods"""
from urllib.parse import quote_plus, quote

password = "Anmol$#STock123"

print("Original password:", password)
print("\nDifferent encoding methods:")
print("1. quote_plus:", quote_plus(password))
print("2. quote:", quote(password))
print("3. Manual encoding:")
print("   $ = %24")
print("   # = %23")
print("   Result: Anmol%24%23STock123")

# Test connection strings
encodings = {
    "quote_plus": quote_plus(password),
    "quote": quote(password),
    "manual": "Anmol%24%23STock123"
}

print("\n" + "="*60)
print("Testing connection with different encodings:")
print("="*60)

from sqlalchemy import create_engine, text

for method, encoded_pass in encodings.items():
    try:
        conn_str = f"mysql+pymysql://u215122914_anmolstock:{encoded_pass}@82.180.143.154:3306/u215122914_anmolstock?charset=utf8mb4"
        print(f"\nTrying {method} encoding: {encoded_pass[:20]}...")
        
        engine = create_engine(conn_str, pool_pre_ping=True, connect_args={"charset": "utf8mb4"})
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        print(f"[SUCCESS] {method} encoding works!")
        print(f"Use this in your .env file:")
        print(f'DATABASE_URL="mysql+pymysql://u215122914_anmolstock:{encoded_pass}@82.180.143.154:3306/u215122914_anmolstock?charset=utf8mb4"')
        break
    except Exception as e:
        print(f"[FAILED] {method}: {str(e)[:100]}")

