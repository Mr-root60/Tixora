# backend/app/schemas/event.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EventCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    description: str = ""
    location: str = Field(min_length=2, max_length=150)
    event_date: datetime
    price: int = Field(ge=0)
    total_seats: int = Field(gt=0)
    image_url: str | None = None


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    location: str
    event_date: datetime
    price: int
    total_seats: int
    available_seats: int
    image_url: str | None = None
