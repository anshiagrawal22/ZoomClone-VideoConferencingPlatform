# Zoom Workplace Clone

A fullstack Zoom Workplace web client clone built with Next.js (TypeScript, Tailwind CSS), FastAPI (Python), and SQLite (SQLAlchemy).

---

## Project Structure

```
├── frontend/             # Next.js 14 Web Application
│   ├── app/              # Next.js App Router (Home, Join, In-Meeting views)
│   ├── components/       # UI Components (Sidebar, Header, Chat, MeetingRoom, Modals)
│   ├── lib/              # API clients & client-side state
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/              # FastAPI REST API
│   ├── main.py           # API routes & meeting endpoints
│   ├── schemas.py        # Pydantic request & response schemas
│   └── requirements.txt  # Python backend dependencies
│
└── database/             # SQLite & Database Models
    ├── database.py       # SQLAlchemy engine & session setup
    ├── models.py         # Meeting and Participant models
    ├── seed.py           # Database initializer
    └── zoom.db           # SQLite database file
```

---

## Getting Started

### 1. Database & Backend Setup

Navigate to the `backend` directory or root:

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Initialize the database
python database/seed.py

# Start FastAPI server (runs on port 8000)
cd backend
python -m uvicorn main:app --reload --port 8000
```

The API documentation will be accessible at:
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 2. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend

# Install npm dependencies (if not already installed)
npm install

# Start Next.js development server (runs on port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Features

- **In-Shell Meeting Experience**: The meeting view (video canvas, scoped header, bottom toolbar) renders seamlessly inside the Home tab shell without replacing the top navbar or sidebar navigation.
- **Zoom Workplace Pixel-Matched Design**:
  - Top full-width navigation bar with search, `Ctrl+K` hint, product dropdown, and user avatar.
  - Collapsible left sidebar (`Home`, `Team Chat`, `Meetings`, `Contacts`, `Settings`).
  - Home dashboard with live digital clock, 3 primary action buttons (**Back to Meeting / New Meeting**, **Join**, **Schedule**), and calendar section with authentic beach umbrella empty state.
  - Floating self-view widget with live camera preview and avatar fallback.
- **Interactive Meeting Capabilities**:
  - Live local camera & microphone media capture via `navigator.mediaDevices.getUserMedia`.
  - Screen sharing via `navigator.mediaDevices.getDisplayMedia`.
  - Floating emoji reactions with animated upwards physics.
  - In-meeting chat panel & participants management panel.
  - Instant and scheduled meeting lifecycles with backend SQLite persistence.
