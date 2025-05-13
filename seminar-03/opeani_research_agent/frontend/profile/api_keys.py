import streamlit as st
from utils import _, check_authentication, get_api_keys, add_api_key, delete_api_key

def show_api_keys_page():
    """Отображает страницу управления API ключами."""
    # Проверяем аутентификацию
    check_authentication()
    
    st.title(_("API Keys"))
    st.markdown(_("Здесь вы можете управлять своими API ключами для исследовательского агента."))
    
    # Получаем текущие ключи
    api_keys = get_api_keys(st.session_state.token)
    
    # Отображаем текущие ключи
    if api_keys:
        st.subheader(_("Ваши API ключи"))
        
        for key in api_keys:
            col1, col2, col3 = st.columns([3, 2, 1])
            with col1:
                st.write(f"**{key['name']}**")
            with col2:
                st.text(f"Created: {key['created_at'][:10]}")
            with col3:
                if st.button(_("Delete"), key=f"delete_{key['id']}"):
                    if delete_api_key(st.session_state.token, key['id']):
                        st.success(_("API key deleted successfully!"))
                        st.rerun()
            st.divider()
    else:
        st.info(_("No API keys found."))
    
    # Форма добавления нового ключа
    st.subheader(_("Add API Key"))
    
    with st.form(key="add_key_form", clear_on_submit=True):
        name = st.text_input(_("Key Name"), placeholder="OpenAI API")
        key_value = st.text_input(_("Key Value"), placeholder="sk-...")
        submit_button = st.form_submit_button(_("Add Key"))
        
        if submit_button:
            if name and key_value:
                result = add_api_key(st.session_state.token, name, key_value)
                if result:
                    st.success(_("API key added successfully!"))
                    st.rerun()
            else:
                st.error(_("Пожалуйста, заполните оба поля")) 