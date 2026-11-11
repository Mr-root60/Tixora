# Event Booking – Réservation de billets d'événements

- `backend/` : API Python (FastAPI + PostgreSQL + SQLAlchemy)
- `mobile/`  : application React Native (Expo)

## Prérequis
- Python 3.11+, PostgreSQL 14+
- Node.js 20+, npm, Expo Go (ou émulateur Android/iOS)

## Backend
```
cd backend
python -m venv venv && source venv/bin/activate   # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Docs : http://localhost:8000/docs

## Mobile
```
cd mobile
npm install
npx expo start
```
Adapter `API_URL` dans `mobile/src/api/client.js`.
