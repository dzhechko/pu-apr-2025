import gettext
import os
from pathlib import Path

# Определяем локали
LOCALE_DIR = Path(__file__).parent.parent.parent / "locale"

# Устанавливаем домен для перевода
gettext.bindtextdomain('messages', str(LOCALE_DIR))
gettext.textdomain('messages')

# Создаем функцию для перевода
def _(text: str) -> str:
    """Функция для перевода строк на текущий язык."""
    return gettext.gettext(text)

# Функция для установки локали
def set_locale(lang: str = 'ru'):
    """Установка языка локализации."""
    try:
        translation = gettext.translation('messages', localedir=str(LOCALE_DIR), languages=[lang])
        translation.install()
    except FileNotFoundError:
        # Если перевод не найден, используем оригинальные строки
        gettext.install('messages')
        
# Устанавливаем русский язык по умолчанию
set_locale('ru') 