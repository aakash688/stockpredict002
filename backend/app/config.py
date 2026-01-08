from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # API Keys
    ALPHA_VANTAGE_API_KEY: str = ""
    FINNHUB_API_KEY: str = ""
    EXCHANGE_RATE_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Ignore extra fields that might be parsed incorrectly
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Fix DATABASE_URL if it was incorrectly parsed (missing charset part)
        if self.DATABASE_URL and '?charset=' not in self.DATABASE_URL and self.DATABASE_URL.startswith('mysql'):
            # Check if charset was parsed as separate field
            charset_val = os.getenv('charset', '')
            if charset_val:
                self.DATABASE_URL += f'?charset={charset_val}'
            elif '?' not in self.DATABASE_URL:
                self.DATABASE_URL += '?charset=utf8mb4'


settings = Settings()
