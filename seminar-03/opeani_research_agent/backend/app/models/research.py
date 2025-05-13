from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship, JSON
from app.models.user import User

class ResearchStatus(str, Enum):
    """Статусы исследования."""
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"


class ResearchJobBase(SQLModel):
    """Базовая модель исследовательской задачи."""
    topic: str


class ResearchJob(ResearchJobBase, table=True):
    """Модель исследовательской задачи для хранения в БД."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    status: ResearchStatus = Field(default=ResearchStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Отношения
    user: User = Relationship(back_populates="research_jobs")
    facts: List["ResearchFact"] = Relationship(back_populates="job")
    report: Optional["ResearchReport"] = Relationship(back_populates="job")


class ResearchJobCreate(ResearchJobBase):
    """Модель для создания исследовательской задачи."""
    pass


class ResearchJobRead(ResearchJobBase):
    """Модель для чтения исследовательской задачи."""
    id: uuid.UUID
    status: ResearchStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class ResearchFactBase(SQLModel):
    """Базовая модель факта исследования."""
    fact: str
    source: Optional[str] = None


class ResearchFact(ResearchFactBase, table=True):
    """Модель факта исследования для хранения в БД."""
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: uuid.UUID = Field(foreign_key="researchjob.id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Отношения
    job: ResearchJob = Relationship(back_populates="facts")


class ResearchFactRead(ResearchFactBase):
    """Модель для чтения факта исследования."""
    id: int
    timestamp: datetime
    
    class Config:
        orm_mode = True


class ResearchReportBase(SQLModel):
    """Базовая модель отчета исследования."""
    title: str
    outline: List[str]
    report: str
    sources: List[str]
    word_count: int


class ResearchReport(ResearchReportBase, table=True):
    """Модель отчета исследования для хранения в БД."""
    job_id: uuid.UUID = Field(primary_key=True, foreign_key="researchjob.id")
    
    # Отношения
    job: ResearchJob = Relationship(back_populates="report")


class ResearchReportRead(ResearchReportBase):
    """Модель для чтения отчета исследования."""
    job_id: uuid.UUID
    
    class Config:
        orm_mode = True


class ResearchPlan(SQLModel):
    """Модель плана исследования."""
    topic: str
    search_queries: List[str]
    focus_areas: List[str] 