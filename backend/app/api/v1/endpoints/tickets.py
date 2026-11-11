# backend/app/api/v1/endpoints/tickets.py
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ticket import TicketOut, TicketValidate, TicketValidateResult
from app.services import ticket_service
from app.utils.qrcode_gen import make_qr_png

router = APIRouter()


@router.get("/me", response_model=list[TicketOut])
def my_tickets(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tickets = ticket_service.list_user_tickets(db, user)
    # TicketOut attend un champ "event" : on le prend sur la réservation du billet
    return [
        TicketOut(id=t.id, code=t.code, is_used=t.is_used, event=t.booking.event)
        for t in tickets
    ]


@router.get("/{code}/qrcode")
def ticket_qrcode(code: str, _user: User = Depends(get_current_user)):
    return Response(content=make_qr_png(code), media_type="image/png")


@router.post("/validate", response_model=TicketValidateResult)
def validate(
    data: TicketValidate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    ok, message = ticket_service.validate_ticket(db, data.code)
    return TicketValidateResult(valid=ok, message=message)
