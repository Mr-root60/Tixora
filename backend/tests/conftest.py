# backend/tests/conftest.py
# Exécuté par pytest AVANT les tests : fournit de fausses valeurs de configuration,
# pour que les tests fonctionnent sans fichier .env (ex. sur un autre ordinateur).
import os

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "cle-de-test-uniquement")
