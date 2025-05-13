from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr

class UserBase(SQLModel):
    """Базовая модель пользователя."""
    email: EmailStr = Field(index=True, unique=True)


class User(UserBase, table=True):
    """Модель пользователя для хранения в БД."""
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Отношения
    api_keys: List["APIKey"] = Relationship(back_populates="user")
    research_jobs: List["ResearchJob"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """Модель для создания пользователя."""
    password: str


class UserRead(UserBase):
    """Модель для чтения данных пользователя."""
    id: int
    created_at: datetime


class Token(SQLModel):
    """Модель для токена авторизации."""
    access_token: str
    token_type: str


class TokenPayload(SQLModel):
    """Модель для данных токена."""
    sub: Optional[int] = None 