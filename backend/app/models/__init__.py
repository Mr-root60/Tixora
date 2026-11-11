# backend/app/models/__init__.py
# Importer tous les modèles ici garantit que SQLAlchemy les connaît
# avant de créer les tables.
from app.models.user import User  # noqa: F401
from app.models.event import Event  # noqa: F401
from app.models.booking import Booking  # noqa: F401
from app.models.ticket import Ticket  # noqa: F401
from app.models.payment import Payment  # noqa: F401
