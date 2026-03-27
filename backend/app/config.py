# ScamVerse - HackMol 7.0
# config.py - reads .env file settings

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # only one key needed - gemini is free
    gemini_api_key: Optional[str] = None

    # app settings
    environment: str = "development"
    app_name: str = "ScamVerse API"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()