# backend/app/services/event_service.py
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.event import Event
from app.schemas.event import EventCreate


def list_events(db: Session, search: str | None = None) -> list[Event]:
    query = select(Event).order_by(Event.event_date)
    if search:
        query = query.where(Event.title.ilike(f"%{search}%"))
    return list(db.scalars(query))


def get_event(db: Session, event_id: int) -> Event:
    event = db.get(Event, event_id)
    if event is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Événement introuvable")
    return event


def create_event(db: Session, data: EventCreate) -> Event:
    event = Event(**data.model_dump(), available_seats=data.total_seats)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def seed_sample_events(db: Session) -> None:
    """Ajoute 3 événements d'exemple si la table est vide."""
    if db.scalar(select(Event.id).limit(1)):
        return
    now = datetime.utcnow()
    samples = [
        ("Soirée Afrobeat", "Une nuit de musique et de danse.", "Douala, Akwa", 5000, 200, 10),
        ("Conférence Tech Cameroun", "Rencontres autour du numérique.", "Yaoundé, Palais des Congrès", 10000, 150, 20),
        ("Festival de la Gastronomie", "Dégustations et cuisine locale.", "Kribi, Plage", 3000, 500, 30),
    ]
    for title, desc, place, price, seats, days in samples:
        db.add(Event(
            title=title, description=desc, location=place,
            event_date=now + timedelta(days=days), price=price,
            total_seats=seats, available_seats=seats,
        ))
    db.commit()
