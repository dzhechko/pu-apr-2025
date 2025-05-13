from typing import Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session, select
import uuid
from datetime import datetime

from app.core.database import get_session
from app.auth.deps import get_current_user
from app.models.user import User
from app.models.research import (
    ResearchJob, ResearchJobCreate, ResearchJobRead,
    ResearchFact, ResearchFactRead, ResearchReport, ResearchReportRead,
    ResearchStatus
)
from app.research.agent import run_research
from app.core.i18n import _

router = APIRouter()

# Функция для обновления статуса задачи
def update_job_status(db: Session, job_id: str, status: ResearchStatus):
    """Обновляет статус исследовательской задачи."""
    job = db.exec(
        select(ResearchJob).where(ResearchJob.id == job_id)
    ).first()
    
    if job:
        job.status = status
        job.updated_at = datetime.utcnow()
        db.add(job)
        db.commit()
        db.refresh(job)

# Функция для сохранения факта
def save_research_fact(db: Session, job_id: str, fact_data: Dict[str, Any]):
    """Сохраняет факт исследования в БД."""
    fact = ResearchFact(
        job_id=job_id,
        fact=fact_data["fact"],
        source=fact_data["source"],
        timestamp=datetime.utcnow()
    )
    db.add(fact)
    db.commit()
    db.refresh(fact)

# Функция для сохранения отчета
def save_research_report(db: Session, job_id: str, report_data: ResearchReport):
    """Сохраняет отчет исследования в БД."""
    report = ResearchReport(
        job_id=job_id,
        title=report_data.title,
        outline=report_data.outline,
        report=report_data.report,
        sources=report_data.sources,
        word_count=report_data.word_count
    )
    db.add(report)
    db.commit()
    db.refresh(report)

# Фоновая задача для запуска исследования
async def background_research_task(
    job_id: str, 
    topic: str, 
    db_session_factory
):
    """Запускает исследование в фоновом режиме."""
    # Создаем новую сессию для фонового процесса
    with Session(db_session_factory()) as db:
        # Создаем колбэки для сохранения фактов и обновления статуса
        def save_fact_callback(job_id: str, fact_data: Dict[str, Any]):
            save_research_fact(db, job_id, fact_data)
            
        def update_job_callback(job_id: str, status: ResearchStatus):
            update_job_status(db, job_id, status)
        
        # Запускаем исследование
        report = await run_research(
            job_id, 
            topic, 
            save_fact_callback,
            update_job_callback
        )
        
        # Если отчет получен, сохраняем его
        if report:
            save_research_report(db, job_id, report)


@router.post("/start", response_model=Dict[str, str], status_code=status.HTTP_202_ACCEPTED)
async def start_research(
    research_in: ResearchJobCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> Any:
    """Запуск нового исследования."""
    # Создаем новую задачу исследования
    job_id = uuid.uuid4()
    job = ResearchJob(
        id=job_id,
        topic=research_in.topic,
        user_id=current_user.id,
        status=ResearchStatus.PENDING
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Запускаем фоновую задачу
    background_tasks.add_task(
        background_research_task,
        str(job_id),
        research_in.topic,
        lambda: db.get_bind()
    )
    
    return {"job_id": str(job_id)}


@router.get("/status/{job_id}", response_model=Dict[str, Any])
async def get_research_status(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> Any:
    """Получение статуса исследования и собранных фактов."""
    # Проверяем существование задачи и принадлежность пользователю
    job = db.exec(
        select(ResearchJob).where(
            (ResearchJob.id == job_id) & 
            (ResearchJob.user_id == current_user.id)
        )
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=404,
            detail=_("Исследование не найдено.")
        )
    
    # Получаем факты
    facts = db.exec(
        select(ResearchFact).where(ResearchFact.job_id == job_id)
    ).all()
    
    # Возвращаем статус и факты
    return {
        "status": job.status,
        "collected_facts": [
            {
                "fact": fact.fact,
                "source": fact.source,
                "timestamp": fact.timestamp.isoformat()
            }
            for fact in facts
        ]
    }


@router.get("/report/{job_id}", response_model=Optional[ResearchReportRead])
async def get_research_report(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> Any:
    """Получение отчета по исследованию."""
    # Проверяем существование задачи и принадлежность пользователю
    job = db.exec(
        select(ResearchJob).where(
            (ResearchJob.id == job_id) & 
            (ResearchJob.user_id == current_user.id)
        )
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=404,
            detail=_("Исследование не найдено.")
        )
    
    # Проверяем статус задачи
    if job.status != ResearchStatus.DONE:
        raise HTTPException(
            status_code=400,
            detail=_("Отчет еще не готов. Текущий статус: ") + job.status
        )
    
    # Получаем отчет
    report = db.exec(
        select(ResearchReport).where(ResearchReport.job_id == job_id)
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=404,
            detail=_("Отчет не найден.")
        )
    
    return report 