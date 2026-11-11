# backend/app/api/v1/router.py
from fastapi import APIRouter

from app.api.v1.endpoints import auth, bookings, events, payments, tickets

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentification"])
api_router.include_router(events.router, prefix="/events", tags=["Événements"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Réservations"])
api_router.include_router(payments.router, prefix="/payments", tags=["Paiements"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["Billets"])
