# backend/app/main.py
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401  (enregistre les tables)
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.event_service import seed_sample_events


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Au démarrage : créer les tables manquantes + événements d'exemple
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_sample_events(db)
    yield


app = FastAPI(title="Event Booking API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Santé"])
def health():
    return {"status": "ok"}
