from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str | None = None
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


def get_settings():
    return Settings()