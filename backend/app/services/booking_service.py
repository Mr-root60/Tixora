# backend/app/services/booking_service.py
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.event import Event
from app.models.user import User
from app.schemas.booking import BookingCreate


def create_booking(db: Session, user: User, data: BookingCreate) -> Booking:
    # with_for_update() verrouille la ligne : deux personnes qui réservent
    # en même temps ne peuvent pas prendre la même dernière place.
    event = db.scalar(select(Event).where(Event.id == data.event_id).with_for_update())
    if event is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Événement introuvable")
    if event.available_seats < data.quantity:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Il ne reste que {event.available_seats} place(s)",
        )
    event.available_seats -= data.quantity
    booking = Booking(
        user_id=user.id,
        event_id=event.id,
        quantity=data.quantity,
        total_amount=event.price * data.quantity,  # calculé ICI, jamais par le téléphone
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_user_booking(db: Session, user: User, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id)
    if booking is None or booking.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Réservation introuvable")
    return booking


def list_user_bookings(db: Session, user: User) -> list[Booking]:
    query = select(Booking).where(Booking.user_id == user.id).order_by(Booking.id.desc())
    return list(db.scalars(query))


def cancel_booking(db: Session, user: User, booking_id: int) -> Booking:
    booking = get_user_booking(db, user, booking_id)
    if booking.status != "pending":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Seule une réservation en attente peut être annulée")
    event = db.scalar(select(Event).where(Event.id == booking.event_id).with_for_update())
    event.available_seats += booking.quantity  # on rend les places
    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking
