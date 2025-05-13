import streamlit as st
from utils import _, login_user, register_user

def show_login_page():
    """Отображает страницу входа."""
    st.title(_("OpenAI Researcher Agent"))
    
    # Создаем вкладки для входа и регистрации
    login_tab, register_tab = st.tabs([_("Login"), _("Register")])
    
    # Вкладка входа
    with login_tab:
        st.subheader(_("Login"))
        
        # Форма входа
        with st.form(key="login_form", clear_on_submit=True):
            email = st.text_input(_("Email"), placeholder="example@mail.com")
            password = st.text_input(_("Password"), type="password")
            submit_button = st.form_submit_button(_("Submit"))
            
            if submit_button:
                if email and password:
                    # Пытаемся залогиниться
                    result = login_user(email, password)
                    if result and "access_token" in result:
                        # Сохраняем токен в сессии
                        st.session_state.token = result["access_token"]
                        st.success(_("Login successful!"))
                        st.rerun()
                else:
                    st.error(_("Please enter email and password"))
    
    # Вкладка регистрации
    with register_tab:
        st.subheader(_("Register"))
        
        # Форма регистрации
        with st.form(key="register_form", clear_on_submit=True):
            email = st.text_input(_("Email"), placeholder="example@mail.com")
            password = st.text_input(_("Password"), type="password")
            confirm_password = st.text_input(_("Confirm Password"), type="password")
            submit_button = st.form_submit_button(_("Submit"))
            
            if submit_button:
                if not email or not password:
                    st.error(_("Please enter email and password"))
                elif password != confirm_password:
                    st.error(_("Passwords do not match"))
                else:
                    # Пытаемся зарегистрироваться
                    result = register_user(email, password)
                    if result and "access_token" in result:
                        # Сохраняем токен в сессии
                        st.session_state.token = result["access_token"]
                        st.success(_("Registration successful!"))
                        st.rerun() 