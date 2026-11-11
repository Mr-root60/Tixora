# backend/app/services/ticket_service.py
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.ticket import Ticket
from app.models.user import User


def generate_tickets(db: Session, booking: Booking) -> list[Ticket]:
    """Crée un billet (avec un code unique) par place réservée."""
    tickets = [
        Ticket(booking_id=booking.id, code=uuid.uuid4().hex.upper())
        for _ in range(booking.quantity)
    ]
    db.add_all(tickets)
    return tickets


def list_user_tickets(db: Session, user: User) -> list[Ticket]:
    query = (
        select(Ticket)
        .join(Booking)
        .where(Booking.user_id == user.id)
        .order_by(Ticket.id.desc())
    )
    return list(db.scalars(query))


def validate_ticket(db: Session, code: str) -> tuple[bool, str]:
    """Contrôle d'entrée : accepte un billet une seule fois."""
    ticket = db.scalar(select(Ticket).where(Ticket.code == code))
    if ticket is None:
        return False, "Billet inconnu"
    if ticket.is_used:
        return False, "Billet déjà utilisé"
    ticket.is_used = True
    db.commit()
    return True, "Billet valide : entrée autorisée"
