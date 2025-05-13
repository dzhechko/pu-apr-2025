import streamlit as st
from auth.login import show_login_page
from profile.api_keys import show_api_keys_page
from research.research import show_research_page
from utils import _

# Инициализация сессии
if "page" not in st.session_state:
    st.session_state.page = "login" if "token" not in st.session_state else "research"

# Функция навигации
def navigate_to(page):
    st.session_state.page = page
    st.rerun()

# Основная функция приложения
def main():
    # Настройка конфигурации страницы
    st.set_page_config(
        page_title=_("OpenAI Researcher Agent"),
        page_icon="📰",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Если пользователь аутентифицирован, показываем меню
    if "token" in st.session_state:
        # Создаем меню навигации
        with st.sidebar:
            st.title(_("OpenAI Researcher Agent"))
            
            # Навигационные кнопки
            st.button(_("Research"), on_click=navigate_to, args=["research"])
            st.button(_("API Keys"), on_click=navigate_to, args=["api_keys"])
            
            # Кнопка выхода
            if st.button(_("Logout")):
                # Очищаем сессию при выходе
                st.session_state.pop("token", None)
                st.session_state.page = "login"
                st.success(_("You have been logged out."))
                st.rerun()
    
    # Отображаем соответствующую страницу
    if st.session_state.page == "login" or "token" not in st.session_state:
        show_login_page()
    elif st.session_state.page == "api_keys":
        show_api_keys_page()
    elif st.session_state.page == "research":
        show_research_page()
    else:
        # По умолчанию показываем страницу исследований
        show_research_page()

if __name__ == "__main__":
    main() 