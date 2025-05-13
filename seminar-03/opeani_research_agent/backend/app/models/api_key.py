from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from app.models.user import User

class APIKeyBase(SQLModel):
    """Базовая модель API ключа."""
    name: str = Field(max_length=100)
    key_value: str


class APIKey(APIKeyBase, table=True):
    """Модель API ключа для хранения в БД."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Отношения
    user: User = Relationship(back_populates="api_keys")


class APIKeyCreate(APIKeyBase):
    """Модель для создания API ключа."""
    pass


class APIKeyRead(APIKeyBase):
    """Модель для чтения API ключа."""
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True 