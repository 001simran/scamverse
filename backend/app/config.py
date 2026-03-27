# ScamVerse - HackMol 7.0
# config.py - reads .env file settings

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    gemini_api_key: Optional[str] = None
    
    # App Settings
    environment: str = "development"
    app_name: str = "ScamVerse API"
    
    # Frontend URLs
    vite_api_url: Optional[str] = "http://localhost:8000"
    frontend_origin: Optional[str] = "http://localhost:5173"
    
    # Security
    secret_key: Optional[str] = None
    access_token_expire_minutes: int = 1440
    
    # Database
    database_url: Optional[str] = None  # ← ADD THIS LINE
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # If you want to allow any extra fields, change to:
        # extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()