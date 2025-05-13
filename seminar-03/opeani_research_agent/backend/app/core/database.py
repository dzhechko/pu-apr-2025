from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

# Создание движка БД
engine = create_engine(
    settings.DATABASE_URL, 
    echo=False, 
    pool_pre_ping=True
)

# Функция для создания всех таблиц
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Функция для получения сессии БД
def get_session():
    with Session(engine) as session:
        yield session 