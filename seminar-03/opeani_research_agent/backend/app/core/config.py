import os
from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Настройки приложения."""
    
    # Общие настройки
    PROJECT_NAME: str = "Исследовательский агент OpenAI"
    API_V1_STR: str = "/api/v1"
    
    # Настройки БД
    DATABASE_URL: str = Field(
        default=os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/research_db")
    )
    
    # Настройки безопасности
    SECRET_KEY: str = Field(
        default=os.getenv("SECRET_KEY", "supersecretkey")
    )
    ALGORITHM: str = Field(
        default=os.getenv("ALGORITHM", "HS256")
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    )
    
    # Настройки OpenAI API
    OPENAI_API_KEY: str = Field(
        default=os.getenv("OPENAI_API_KEY", "")
    )
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings() 