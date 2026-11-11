from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    """Ouvre une session pour une requête, puis la ferme quoi qu'il arrive."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
