from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Database - defaults to SQLite for local dev
    database_url: str = "sqlite:///./scamverse.db"
    
    # API Keys - optional, falls back to keyword analysis
    gemini_api_key: Optional[str] = None
    
    # CORS
    frontend_origin: str = "http://localhost:5174"
    
    # JWT Authentication
    secret_key: str = "dev_secret_key_change_in_production_please"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

def get_settings():
    return Settings()