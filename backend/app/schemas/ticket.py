# backend/app/schemas/ticket.py
from pydantic import BaseModel, ConfigDict

from app.schemas.event import EventOut


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    is_used: bool
    event: EventOut


class TicketValidate(BaseModel):
    code: str


class TicketValidateResult(BaseModel):
    valid: bool
    message: str
