from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_db_and_tables

# Импорт роутеров
from app.auth.routes import router as auth_router
from app.api_keys.routes import router as api_keys_router
from app.research.routes import router as research_router

# Создаем приложение FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API для исследовательского агента OpenAI",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене следует указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем главный роутер API
api_router = APIRouter(prefix=settings.API_V1_STR)

# Подключаем роутеры
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(api_keys_router, prefix="/user/keys", tags=["api_keys"])
api_router.include_router(research_router, prefix="/research", tags=["research"])

# Подключаем главный роутер к приложению
app.include_router(api_router)

# Событие при запуске приложения
@app.on_event("startup")
def on_startup():
    # Создаем таблицы в БД при запуске
    create_db_and_tables()

# Корневой эндпоинт
@app.get("/")
async def root():
    return {
        "message": "Добро пожаловать в API исследовательского агента OpenAI",
        "docs_url": "/docs"
    } 