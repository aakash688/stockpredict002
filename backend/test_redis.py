"""Test Redis connection and diagnose issues"""
import redis
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

redis_url = os.getenv('REDIS_URL', '')

if not redis_url:
    print("[ERROR] REDIS_URL not found in .env file")
    print("\nPlease add REDIS_URL to your .env file:")
    print("  REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_ENDPOINT.upstash.io:6379")
    sys.exit(1)

# Mask password in output
masked_url = redis_url.split('@')[0] + '@' + '...' if '@' in redis_url else redis_url
print(f"Testing Redis connection: {masked_url}")
print("=" * 60)

# Check URL format
use_ssl = redis_url.startswith('rediss://')
use_plain = redis_url.startswith('redis://')

if not (use_ssl or use_plain):
    print("[ERROR] Invalid REDIS_URL format")
    print("  → Should start with 'redis://' or 'rediss://'")
    print("  → Use 'rediss://' (with double s) for Upstash/TLS")
    sys.exit(1)

print(f"[INFO] Protocol: {'TLS (rediss://)' if use_ssl else 'Plain (redis://)'}")

# Try connection
try:
    connection_params = {
        'decode_responses': True,
        'socket_connect_timeout': 10,
        'socket_timeout': 10,
    }
    
    # Add SSL configuration for Upstash
    if use_ssl:
        connection_params['ssl_cert_reqs'] = None
        print("[INFO] Using TLS/SSL connection (Upstash compatible)")
    
    print("\n[TEST] Attempting connection...")
    client = redis.from_url(redis_url, **connection_params)
    
    print("[TEST] Testing ping...")
    result = client.ping()
    print(f"[SUCCESS] Ping successful: {result}")
    
    print("\n[TEST] Testing write/read...")
    test_key = "test_connection"
    test_value = "Hello Redis!"
    client.set(test_key, test_value, ex=60)
    retrieved = client.get(test_key)
    
    if retrieved == test_value:
        print(f"[SUCCESS] Write/read test passed: {retrieved}")
    else:
        print(f"[WARNING] Write/read test failed: expected '{test_value}', got '{retrieved}'")
    
    # Clean up
    client.delete(test_key)
    
    print("\n" + "=" * 60)
    print("[SUCCESS] Redis connection is working correctly!")
    print("  Your REDIS_URL is valid and accessible")
    print("  The backend should connect successfully")
    
except redis.ConnectionError as e:
    print(f"\n[ERROR] Connection failed: {e}")
    print("\nPossible causes:")
    print("  1. Redis server is not running or not accessible")
    print("  2. Wrong host/port in REDIS_URL")
    print("  3. Firewall blocking the connection")
    print("  4. Network connectivity issues")
    sys.exit(1)
    
except redis.TimeoutError as e:
    print(f"\n[ERROR] Connection timeout: {e}")
    print("\nPossible causes:")
    print("  1. Redis server is slow or overloaded")
    print("  2. Network latency is too high")
    print("  3. Firewall blocking the connection")
    sys.exit(1)
    
except redis.AuthenticationError as e:
    print(f"\n[ERROR] Authentication failed: {e}")
    print("\nPossible causes:")
    print("  1. Wrong password in REDIS_URL")
    print("  2. Password contains special characters that need URL encoding")
    print("  3. User doesn't have access permissions")
    sys.exit(1)
    
except Exception as e:
    print(f"\n[ERROR] Unexpected error: {e}")
    print(f"  Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

