import redis
import json
from typing import Optional, Any
from app.config import settings

redis_client = None

def init_redis():
    """Initialize Redis connection with proper TLS handling for Upstash"""
    global redis_client
    
    if redis_client is not None:
        return redis_client
    
    try:
        redis_url = settings.REDIS_URL
        
        # Check if URL uses rediss:// (TLS) or redis://
        use_ssl = redis_url.startswith('rediss://')
        
        # Configure connection parameters
        connection_params = {
            'decode_responses': True,
            'socket_connect_timeout': 10,
            'socket_timeout': 10,
        }
        
        # Add SSL configuration for Upstash
        if use_ssl:
            connection_params['ssl_cert_reqs'] = None  # Upstash doesn't require cert verification
        
        # Try to connect to Redis
        redis_client = redis.from_url(redis_url, **connection_params)
        
        # Test connection with a ping
        redis_client.ping()
        print("✓ Redis connection successful!")
        return redis_client
        
    except redis.ConnectionError as e:
        print(f"✗ Redis connection failed: Connection error - {str(e)}")
        print("  → Caching will be disabled. This is optional and won't affect app functionality.")
        redis_client = None
        return None
    except redis.TimeoutError as e:
        print(f"✗ Redis connection failed: Timeout - {str(e)}")
        print("  → Caching will be disabled. This is optional and won't affect app functionality.")
        redis_client = None
        return None
    except Exception as e:
        print(f"✗ Redis connection failed: {str(e)}")
        print("  → Caching will be disabled. This is optional and won't affect app functionality.")
        print("  → Tip: Check your REDIS_URL in .env file. Use 'rediss://' (with double s) for TLS.")
        redis_client = None
        return None

# Initialize Redis on module import
redis_client = init_redis()


def get_cache(key: str) -> Optional[Any]:
    if redis_client is None:
        return None
    try:
        value = redis_client.get(key)
        if value:
            return json.loads(value)
    except Exception:
        pass
    return None


def set_cache(key: str, value: Any, ttl: int = 900) -> bool:
    if redis_client is None:
        return False
    try:
        redis_client.setex(key, ttl, json.dumps(value))
        return True
    except Exception:
        return False


def delete_cache(key: str) -> bool:
    if redis_client is None:
        return False
    try:
        redis_client.delete(key)
        return True
    except Exception:
        return False


def delete_cache_pattern(pattern: str) -> bool:
    if redis_client is None:
        return False
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
        return True
    except Exception:
        return False

