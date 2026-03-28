from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # API Keys
    gemini_api_key: str
    
    # CORS
    frontend_origin: str
    
    # JWT Authentication
    secret_key: str
    access_token_expire_minutes: int = 30  # Default 30 minutes
    algorithm: str = "HS256"  # Default algorithm
    
    # Optional: Add any other fields your app uses
    # debug: bool = False
    # allowed_origins: list = []
    
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )

def get_settings():
    return Settings()