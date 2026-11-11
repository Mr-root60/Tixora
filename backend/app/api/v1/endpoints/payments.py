# backend/app/api/v1/endpoints/payments.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut
from app.services import payment_service

router = APIRouter()


@router.post("", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def pay(
    data: PaymentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return payment_service.pay_booking(db, user, data)
