# OpenAI Research Agent

Исследовательский агент на базе OpenAI, который автоматизирует процесс поиска информации и создания исследовательских отчетов по заданной теме.

## Особенности

- Мультиагентная система на базе OpenAI Agents SDK
- Веб-интерфейс на Streamlit с переводом на русский язык
- Модульная архитектура с разделением на бэкенд (FastAPI) и фронтенд (Streamlit)
- Аутентификация пользователей (email + пароль)
- Личный кабинет для управления API-ключами
- Хранение данных в PostgreSQL
- Контейнеризация через Docker и Docker Compose

## Архитектура

- **Backend**:
  - FastAPI
  - PostgreSQL
  - Alembic для миграций
  - SQLModel для работы с БД
  - JWT аутентификация
  - i18n поддержка

- **Frontend**:
  - Streamlit
  - Поддержка русской локализации
  - Интеграция с API бэкенда

## Установка и запуск

### Предварительные требования

- Docker и Docker Compose
- Ключ API OpenAI

### Запуск

1. Клонировать репозиторий:
```bash
git clone <repository-url>
cd openai-research-agent
```

2. Создать файл `.env` в корне проекта:
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
SECRET_KEY=YOUR_SECRET_KEY
```

3. Запустить приложение через Docker Compose:
```bash
docker-compose up -d
```

4. Открыть приложение:
   - Frontend: http://localhost:8501
   - Backend API: http://localhost:8000/docs

## Использование

1. Зарегистрируйтесь или войдите в систему
2. Добавьте необходимые API-ключи в личном кабинете
3. Перейдите на страницу исследований
4. Введите тему для исследования
5. Дождитесь завершения исследования и получите готовый отчет

## Разработка

### Структура проекта

```
openai-research-agent/
├── backend/             # FastAPI бэкенд
│   ├── app/             # Код приложения
│   │   ├── api_keys/    # API-ключи
│   │   ├── auth/        # Аутентификация
│   │   ├── core/        # Ядро приложения
│   │   ├── models/      # Модели данных
│   │   ├── research/    # Исследовательские функции
│   │   └── tests/       # Тесты
│   ├── migrations/      # Миграции Alembic
│   └── locale/          # Файлы локализации
├── frontend/            # Streamlit фронтенд
│   ├── auth/            # Аутентификация
│   ├── profile/         # Личный кабинет
│   └── research/        # Исследования
├── docker-compose.yml   # Docker Compose конфигурация
└── README.md            # Документация
```

### Локальная разработка

1. Установить зависимости:
```bash
pip install -r requirements.txt
```

2. Запустить PostgreSQL:
```bash
docker-compose up -d postgres
```

3. Запустить бэкенд:
```bash
cd backend
uvicorn app.main:app --reload
```

4. Запустить фронтенд:
```bash
cd frontend
streamlit run main.py
```

## Лицензия

MIT