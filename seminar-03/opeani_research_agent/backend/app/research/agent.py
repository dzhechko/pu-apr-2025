import os
from datetime import datetime
import asyncio
from typing import List, Dict, Any, Optional, Callable

from agents import Agent, Runner, WebSearchTool, function_tool, handoff, trace
from app.models.research import ResearchJob, ResearchFact, ResearchReport, ResearchPlan, ResearchStatus

# Функция для сохранения фактов
def create_save_fact_tool(job_id: str, save_fact_callback: Callable) -> Callable:
    """Создает инструмент для сохранения фактов."""
    
    @function_tool
    def save_important_fact(fact: str, source: str = None) -> str:
        """Сохранить важный факт, обнаруженный во время исследования.
        
        Args:
            fact: Важный факт для сохранения
            source: Опциональный источник факта
        
        Returns:
            Сообщение подтверждения
        """
        # Создаем объект факта
        fact_obj = {
            "fact": fact,
            "source": source or "Не указан",
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
        
        # Вызываем callback для сохранения факта
        save_fact_callback(job_id, fact_obj)
        
        return f"Факт сохранен: {fact}"
    
    return save_important_fact


# Создаем агентов
def create_research_agents(job_id: str, save_fact_callback: Callable):
    """Создает и возвращает настроенных агентов для исследования."""
    
    # Инструмент для сохранения фактов
    save_important_fact = create_save_fact_tool(job_id, save_fact_callback)
    
    # Исследовательский агент
    research_agent = Agent(
        name="Исследовательский агент",
        instructions="Вы исследовательский ассистент. Получив поисковый запрос, вы ищете в интернете"
        "по этому запросу и создаете краткую сводку результатов. Сводка должна быть из 2-3 абзацев и"
        "не превышать 300 слов. Отразите главные моменты. Пишите кратко, без необходимости полных"
        "предложений или хорошей грамматики. Это будет использовано кем-то, кто синтезирует отчет, так что"
        "важно уловить суть и игнорировать все лишнее. Не включайте никаких дополнительных комментариев,"
        "кроме самой сводки.",
        model="gpt-4o-mini",
        tools=[
            WebSearchTool(),
            save_important_fact
        ],
    )

    # Редакторский агент
    editor_agent = Agent(
        name="Редакторский агент",
        handoff_description="Старший исследователь, который пишет подробные исследовательские отчеты",
        instructions="Вы старший исследователь, которому поручено написать связный отчет для"
        "исследовательского запроса. Вам предоставят исходный запрос и некоторые начальные исследования,"
        "проведенные исследовательским ассистентом.\n"
        "Сначала вы должны создать план отчета, который описывает структуру и поток отчета. Затем"
        "сгенерируйте отчет и верните его в качестве итогового результата.\n"
        "Итоговый вывод должен быть в формате markdown, он должен быть объемным и подробным. Стремитесь"
        "к 5-10 страницам контента, не менее 1000 слов.",
        model="gpt-4o-mini",
        output_type=ResearchReport,
    )

    # Триажный агент
    triage_agent = Agent(
        name="Сортировочный агент",
        instructions="""Вы координатор этого исследовательского процесса. Ваша задача:
        1. Понять тему исследования пользователя
        2. Создать план исследования со следующими элементами:
           - topic: Четкое изложение темы исследования
           - search_queries: Список из 3-5 конкретных поисковых запросов, которые помогут собрать информацию
           - focus_areas: Список из 3-5 ключевых аспектов темы для изучения
        3. Передать исследовательскому агенту для сбора информации
        4. После завершения исследования передать редакторскому агенту, который напишет полный отчет
        
        Убедитесь, что ваш план возвращается в ожидаемом структурированном формате с темой, поисковыми запросами и областями фокусировки.
        """,
        handoffs=[
            handoff(research_agent),
            handoff(editor_agent)
        ],
        model="gpt-4o-mini",
        output_type=ResearchPlan,
    )
    
    return triage_agent

# Функция запуска исследования
async def run_research(job_id: str, topic: str, save_fact_callback: Callable, update_job_callback: Callable):
    """Запускает процесс исследования."""
    try:
        # Обновляем статус задачи
        update_job_callback(job_id, ResearchStatus.RUNNING)
        
        # Создаем агентов
        triage_agent = create_research_agents(job_id, save_fact_callback)
        
        # Запускаем исследование в трейсе
        with trace("Исследование новостей", group_id=job_id):
            # Запускаем триажного агента
            triage_result = await Runner.run(
                triage_agent,
                f"Тщательно исследуйте эту тему: {topic}. Это исследование будет использовано для создания полного исследовательского отчета."
            )
            
            # Сохраняем результат (отчет)
            if hasattr(triage_result.final_output, 'report'):
                report = triage_result.final_output
                # Обновляем статус на выполнено
                update_job_callback(job_id, ResearchStatus.DONE)
                return report
            else:
                # Если отчет не получен, обрабатываем ошибку
                update_job_callback(job_id, ResearchStatus.FAILED)
                return None
                
    except Exception as e:
        # Обновляем статус на ошибку
        update_job_callback(job_id, ResearchStatus.FAILED)
        print(f"Ошибка при выполнении исследования: {str(e)}")
        return None 