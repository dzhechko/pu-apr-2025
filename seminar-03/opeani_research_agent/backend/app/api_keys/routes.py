from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.auth.deps import get_current_user
from app.models.user import User
from app.models.api_key import APIKey, APIKeyCreate, APIKeyRead
from app.core.i18n import _

router = APIRouter()

@router.get("/", response_model=List[APIKeyRead])
def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> Any:
    """Получение всех API ключей пользователя."""
    keys = db.exec(
        select(APIKey).where(APIKey.user_id == current_user.id)
    ).all()
    return keys


@router.post("/", response_model=APIKeyRead, status_code=status.HTTP_201_CREATED)
def create_api_key(
    key_in: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> Any:
    """Создание нового API ключа."""
    # Проверяем, есть ли уже ключ с таким именем у пользователя
    existing_key = db.exec(
        select(APIKey).where(
            (APIKey.user_id == current_user.id) & 
            (APIKey.name == key_in.name)
        )
    ).first()
    
    if existing_key:
        raise HTTPException(
            status_code=400,
            detail=_("Ключ с таким именем уже существует.")
        )
    
    # Создаем новый ключ
    api_key = APIKey(
        name=key_in.name,
        key_value=key_in.key_value,
        user_id=current_user.id
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    return api_key


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> None:
    """Удаление API ключа."""
    # Проверяем существование ключа и принадлежность пользователю
    key = db.exec(
        select(APIKey).where(
            (APIKey.id == key_id) & 
            (APIKey.user_id == current_user.id)
        )
    ).first()
    
    if not key:
        raise HTTPException(
            status_code=404,
            detail=_("Ключ не найден.")
        )
    
    # Удаляем ключ
    db.delete(key)
    db.commit()
    
    return None 