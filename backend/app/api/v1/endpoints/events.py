# backend/app/api/v1/endpoints/events.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.event import EventCreate, EventOut
from app.services import event_service

router = APIRouter()


@router.get("", response_model=list[EventOut])
def list_events(search: str | None = None, db: Session = Depends(get_db)):
    return event_service.list_events(db, search)


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    return event_service.get_event(db, event_id)


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return event_service.create_event(db, data)
