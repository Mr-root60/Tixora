# backend/app/services/payment_service.py
import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate
from app.services.booking_service import get_user_booking
from app.services.ticket_service import generate_tickets


def pay_booking(db: Session, user: User, data: PaymentCreate) -> Payment:
    booking = get_user_booking(db, user, data.booking_id)
    if booking.status != "pending":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cette réservation n'est plus payable")
    if data.method == "mobile_money" and not data.phone:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Numéro Mobile Money obligatoire")

    # SIMULATION : ici, on appellerait l'API d'un vrai opérateur de paiement.
    # Dans ce guide le paiement réussit toujours.
    payment = Payment(
        booking_id=booking.id,
        amount=booking.total_amount,
        method=data.method,
        status="success",
        transaction_ref="TX-" + uuid.uuid4().hex[:12].upper(),
    )
    db.add(payment)
    booking.status = "confirmed"
    generate_tickets(db, booking)
    db.commit()
    db.refresh(payment)
    return payment
