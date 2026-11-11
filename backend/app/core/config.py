# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Secrets : AUCUNE valeur par défaut. Elles doivent venir du fichier .env.
    DATABASE_URL: str
    SECRET_KEY: str

    # Réglages non secrets : une valeur par défaut raisonnable est acceptable.
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ADMIN_EMAIL: str = "admin@example.com"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
