import streamlit as st
import time
import uuid
from utils import (
    _, check_authentication, start_research,
    get_research_status, get_research_report
)

def show_research_page():
    """Отображает страницу исследований."""
    # Проверка аутентификации
    check_authentication()
    
    # Установка конфигурации страницы
    st.set_page_config(
        page_title=_("OpenAI Researcher Agent"),
        page_icon="📰",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Заголовок и описание приложения
    st.title(_("OpenAI Researcher Agent"))
    st.subheader(_("Powered by OpenAI Agents SDK"))
    st.markdown(_(
        "This app demonstrates the power of OpenAI's Agents SDK by creating a multi-agent system "
        "that researches news topics and generates comprehensive research reports."
    ))
    
    # Создаем боковую панель для ввода и элементов управления
    with st.sidebar:
        st.header(_("Research Topic"))
        user_topic = st.text_input(
            _("Enter a topic to research:"),
        )
        
        start_button = st.button(_("Start Research"), type="primary", disabled=not user_topic)
        
        st.divider()
        st.subheader(_("Example Topics"))
        example_topics = [
            _("What are the best cruise lines in USA for first-time travelers who have never been on a cruise?"),
            _("What are the best affordable espresso machines for someone upgrading from a French press?"),
            _("What are the best off-the-beaten-path destinations in India for a first-time solo traveler?")
        ]
        
        for topic in example_topics:
            if st.button(topic):
                user_topic = topic
                start_button = True
    
    # Основная область с двумя вкладками
    tab1, tab2 = st.tabs([_("Research Process"), _("Report")])
    
    # Инициализация состояния сессии для хранения результатов
    if "conversation_id" not in st.session_state:
        st.session_state.conversation_id = str(uuid.uuid4().hex[:16])
    if "job_id" not in st.session_state:
        st.session_state.job_id = None
    if "research_done" not in st.session_state:
        st.session_state.research_done = False
    if "report_result" not in st.session_state:
        st.session_state.report_result = None
    
    # Запуск исследования при нажатии кнопки
    if start_button:
        with st.spinner(_("Researching: ") + user_topic):
            try:
                # Сбрасываем предыдущие результаты
                st.session_state.research_done = False
                st.session_state.report_result = None
                
                # Запускаем новое исследование через API
                result = start_research(st.session_state.token, user_topic)
                if result and "job_id" in result:
                    st.session_state.job_id = result["job_id"]
                    st.rerun()
                else:
                    st.error(_("Failed to start research. Please try again."))
            except Exception as e:
                st.error(f"{_('An error occurred during research')}: {str(e)}")
    
    # Если есть активное исследование, показываем его статус
    if st.session_state.job_id and not st.session_state.research_done:
        with tab1:
            message_container = st.container()
            
            # Получаем статус исследования
            status_result = get_research_status(st.session_state.token, st.session_state.job_id)
            
            with message_container:
                st.write(f"🔍 **{_('Research status')}**: {status_result['status']}")
                
                # Отображаем собранные факты
                if status_result["collected_facts"]:
                    st.write(f"📚 **{_('Collected Facts')}:**")
                    for fact in status_result["collected_facts"]:
                        st.info(f"**{_('Fact')}**: {fact['fact']}\n\n**{_('Source')}**: {fact['source']}")
                
                # Проверяем, завершено ли исследование
                if status_result["status"] == "done":
                    st.success(_("Research Complete! Report Generated."))
                    
                    # Получаем отчет
                    report = get_research_report(st.session_state.token, st.session_state.job_id)
                    if report:
                        st.session_state.report_result = report
                        st.session_state.research_done = True
                        
                        # Предпросмотр отчета
                        report_preview = report["report"][:300] + "..."
                        st.write(f"📄 **{_('Report Preview')}:**")
                        st.markdown(report_preview)
                        st.write(_("See the Report tab for the full document."))
                    else:
                        st.error(_("Error retrieving report."))
                
                elif status_result["status"] == "failed":
                    st.error(_("Research failed. Please try again with a different topic."))
                    st.session_state.research_done = True
                
                else:
                    # Если исследование все еще идет, перезагрузим страницу через 3 секунды
                    time.sleep(3)
                    st.rerun()
    
    # Отображаем результаты в вкладке Report
    with tab2:
        if st.session_state.research_done and st.session_state.report_result:
            report = st.session_state.report_result
            
            # Отображаем заголовок
            st.title(report["title"])
            
            # Отображаем план, если доступен
            if report["outline"]:
                with st.expander(_("Report Outline"), expanded=True):
                    for i, section in enumerate(report["outline"]):
                        st.markdown(f"{i+1}. {section}")
            
            # Отображаем количество слов
            st.info(f"{_('Word Count')}: {report['word_count']}")
            
            # Отображаем полный отчет в формате markdown
            st.markdown(report["report"])
            
            # Отображаем источники
            if report["sources"]:
                with st.expander(_("Sources")):
                    for i, source in enumerate(report["sources"]):
                        st.markdown(f"{i+1}. {source}")
            
            # Добавляем кнопку для скачивания отчета
            st.download_button(
                label=_("Download Report"),
                data=report["report"],
                file_name=f"{report['title'].replace(' ', '_')}.md",
                mime="text/markdown"
            ) 