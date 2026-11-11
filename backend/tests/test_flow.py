# backend/tests/test_flow.py
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401
from app.db.base import Base
from app.db.session import get_db
from app.main import app


@pytest.fixture()
def client():
    # Base SQLite en mémoire : vide à chaque test, rien n'est écrit sur disque
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(bind=engine, autoflush=False)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)  # sans "with" : le démarrage (PostgreSQL) n'est pas lancé
    app.dependency_overrides.clear()


def register(client, email, name="Test User"):
    r = client.post("/api/v1/auth/register", json={
        "full_name": name, "email": email, "password": "secret123"})
    assert r.status_code == 201, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_full_flow(client):
    admin = register(client, "admin@example.com", "Admin")
    user = register(client, "joce@example.com", "Joce")

    # un utilisateur simple ne peut pas créer d'événement
    payload = {
        "title": "Concert Test", "location": "Douala", "price": 5000,
        "total_seats": 10, "event_date": (datetime.utcnow() + timedelta(days=5)).isoformat(),
    }
    assert client.post("/api/v1/events", json=payload, headers=user).status_code == 403
    r = client.post("/api/v1/events", json=payload, headers=admin)
    assert r.status_code == 201
    event_id = r.json()["id"]

    # liste + recherche
    assert len(client.get("/api/v1/events").json()) == 1
    assert client.get("/api/v1/events?search=zzz").json() == []

    # on réserve TOUTES les places, puis une de plus : refusé
    r = client.post("/api/v1/bookings", json={"event_id": event_id, "quantity": 10}, headers=user)
    assert r.status_code == 201
    r2 = client.post("/api/v1/bookings", json={"event_id": event_id, "quantity": 1}, headers=user)
    assert r2.status_code == 400  # plus aucune place

    # annulation : les places sont rendues
    booking_id = r.json()["id"]
    assert client.post(f"/api/v1/bookings/{booking_id}/cancel", headers=user).status_code == 200
    assert client.get(f"/api/v1/events/{event_id}").json()["available_seats"] == 10

    # réservation de 2 places = 10000 FCFA, puis paiement
    r = client.post("/api/v1/bookings", json={"event_id": event_id, "quantity": 2}, headers=user)
    assert r.json()["total_amount"] == 10000
    booking_id = r.json()["id"]
    r = client.post("/api/v1/payments", json={
        "booking_id": booking_id, "method": "mobile_money", "phone": "677000000"}, headers=user)
    assert r.status_code == 201 and r.json()["status"] == "success"

    # 2 billets avec des codes différents
    tickets = client.get("/api/v1/tickets/me", headers=user).json()
    assert len(tickets) == 2
    code = tickets[0]["code"]
    assert code != tickets[1]["code"]

    # image QR code
    r = client.get(f"/api/v1/tickets/{code}/qrcode", headers=user)
    assert r.status_code == 200 and r.content[:4] == b"\x89PNG"

    # contrôle d'entrée : valide une fois, refusé la seconde
    assert client.post("/api/v1/tickets/validate", json={"code": code}, headers=user).status_code == 403
    first = client.post("/api/v1/tickets/validate", json={"code": code}, headers=admin).json()
    second = client.post("/api/v1/tickets/validate", json={"code": code}, headers=admin).json()
    assert first["valid"] is True
    assert second["valid"] is False


def test_auth_errors(client):
    register(client, "a@b.com")
    bad = client.post("/api/v1/auth/login", json={"email": "a@b.com", "password": "wrong-pass"})
    assert bad.status_code == 401
    dup = client.post("/api/v1/auth/register", json={
        "full_name": "X Y", "email": "a@b.com", "password": "secret123"})
    assert dup.status_code == 400
    assert client.get("/api/v1/auth/me").status_code in (401, 403)
