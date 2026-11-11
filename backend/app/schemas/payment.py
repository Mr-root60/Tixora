# backend/app/schemas/payment.py
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    booking_id: int
    method: Literal["mobile_money", "card"]
    phone: str | None = None  # numéro Mobile Money (simulation)


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    amount: int
    method: str
    status: str
    transaction_ref: str
    created_at: datetime
