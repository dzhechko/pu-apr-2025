import os
import json
import requests
from typing import Dict, Any, Optional
import streamlit as st
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Определяем URL бэкенда
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
API_V1 = "/api/v1"

# Словарь с переводами
ru_translations = {
    "Research Topic": "Тема исследования",
    "Enter a topic to research:": "Введите тему для исследования:",
    "Start Research": "Начать исследование",
    "Example Topics": "Примеры тем",
    "Research Process": "Процесс исследования",
    "Report": "Отчет",
    "Research Complete! Report Generated.": "Исследование завершено! Отчет сгенерирован.",
    "Report Preview": "Предпросмотр отчета",
    "See the Report tab for the full document.": "Перейдите на вкладку 'Отчет' для просмотра полного документа.",
    "An error occurred during research": "Во время исследования произошла ошибка",
    "Please try again later or with a different topic.": "Пожалуйста, попробуйте позже или используйте другую тему.",
    "Word Count": "Количество слов",
    "Download Report": "Скачать отчет",
    "Sources": "Источники",
    "Report Outline": "План отчета",
    "Collected Facts": "Собранные факты",
    "Fact": "Факт",
    "Source": "Источник",
    "Login": "Вход",
    "Register": "Регистрация",
    "Email": "Email",
    "Password": "Пароль",
    "Submit": "Отправить",
    "Profile": "Личный кабинет",
    "API Keys": "API ключи",
    "Add API Key": "Добавить API ключ",
    "Key Name": "Название ключа",
    "Key Value": "Значение ключа",
    "Delete": "Удалить",
    "No API keys found.": "Ключи API не найдены.",
    "Add Key": "Добавить ключ",
    "API key added successfully!": "API ключ успешно добавлен!",
    "API key deleted successfully!": "API ключ успешно удален!",
    "Error": "Ошибка",
    "Please log in to use this feature.": "Пожалуйста, войдите в систему, чтобы использовать эту функцию.",
    "You have been logged out.": "Вы вышли из системы.",
    "Invalid credentials.": "Неверные учетные данные.",
    "Registration successful!": "Регистрация успешна!",
    "Logout": "Выход",
    "Research in progress...": "Исследование в процессе...",
    "Researching": "Исследование",
    "Please wait while we research your topic.": "Пожалуйста, подождите, пока мы исследуем вашу тему.",
    "Research Agent": "Исследовательский агент",
    "Editor Agent": "Редакторский агент",
    "Triage Agent": "Сортировочный агент",
    "Planning research approach...": "Планирование подхода к исследованию...",
    "Research Plan": "План исследования",
    "Creating comprehensive research report...": "Создание полного исследовательского отчета...",
    "OpenAI Researcher Agent": "Исследовательский агент OpenAI",
    "Powered by OpenAI Agents SDK": "На базе OpenAI Agents SDK",
    "This app demonstrates the power of OpenAI's Agents SDK by creating a multi-agent system that researches news topics and generates comprehensive research reports.": 
    "Это приложение демонстрирует возможности SDK агентов OpenAI, создавая мультиагентную систему, которая исследует новостные темы и генерирует всесторонние исследовательские отчеты."
}

# Функция для перевода текста
def _(text: str) -> str:
    """Переводит текст на русский язык."""
    return ru_translations.get(text, text)

# Функции для взаимодействия с API

def register_user(email: str, password: str) -> Dict[str, Any]:
    """Регистрирует нового пользователя."""
    response = requests.post(
        f"{BACKEND_URL}{API_V1}/auth/register",
        json={"email": email, "password": password}
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        st.error(_(response.json().get("detail", "Ошибка регистрации")))
        return {}

def login_user(email: str, password: str) -> Dict[str, Any]:
    """Аутентифицирует пользователя."""
    response = requests.post(
        f"{BACKEND_URL}{API_V1}/auth/login",
        data={"username": email, "password": password}  # OAuth2 требует username поле
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        st.error(_(response.json().get("detail", "Ошибка входа")))
        return {}

def get_api_keys(token: str) -> list:
    """Получает список API ключей пользователя."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BACKEND_URL}{API_V1}/user/keys",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        if response.status_code == 401:
            # Токен истек, разлогиниваем пользователя
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        else:
            st.error(_(response.json().get("detail", "Ошибка получения ключей API")))
        return []

def add_api_key(token: str, name: str, key_value: str) -> Dict[str, Any]:
    """Добавляет новый API ключ."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BACKEND_URL}{API_V1}/user/keys",
        json={"name": name, "key_value": key_value},
        headers=headers
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        if response.status_code == 401:
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        else:
            st.error(_(response.json().get("detail", "Ошибка добавления ключа API")))
        return {}

def delete_api_key(token: str, key_id: int) -> bool:
    """Удаляет API ключ."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(
        f"{BACKEND_URL}{API_V1}/user/keys/{key_id}",
        headers=headers
    )
    
    if response.status_code == 204:
        return True
    else:
        if response.status_code == 401:
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        else:
            st.error(_(response.json().get("detail", "Ошибка удаления ключа API")))
        return False

def start_research(token: str, topic: str) -> Dict[str, Any]:
    """Запускает новое исследование."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BACKEND_URL}{API_V1}/research/start",
        json={"topic": topic},
        headers=headers
    )
    
    if response.status_code == 202:
        return response.json()
    else:
        if response.status_code == 401:
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        else:
            st.error(_(response.json().get("detail", "Ошибка запуска исследования")))
        return {}

def get_research_status(token: str, job_id: str) -> Dict[str, Any]:
    """Получает статус исследования."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BACKEND_URL}{API_V1}/research/status/{job_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        if response.status_code == 401:
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        return {"status": "failed", "collected_facts": []}

def get_research_report(token: str, job_id: str) -> Dict[str, Any]:
    """Получает отчет по исследованию."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BACKEND_URL}{API_V1}/research/report/{job_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        if response.status_code == 401:
            st.session_state.pop("token", None)
            st.error(_("Сессия истекла. Пожалуйста, войдите снова."))
        return None

# Функции для работы с сессией

def check_authentication():
    """Проверяет аутентификацию пользователя."""
    if "token" not in st.session_state:
        st.warning(_("Пожалуйста, войдите в систему, чтобы использовать эту функцию."))
        st.stop() 