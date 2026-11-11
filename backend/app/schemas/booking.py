# backend/app/schemas/booking.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.event import EventOut


class BookingCreate(BaseModel):
    event_id: int
    quantity: int = Field(ge=1, le=10)


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    quantity: int
    total_amount: int
    status: str
    created_at: datetime
    event: EventOut
