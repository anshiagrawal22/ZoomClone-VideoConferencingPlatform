# 🖥️ Zoom Workplace Clone

A full-stack Zoom Workplace-inspired web application featuring an in-shell meeting experience, video conferencing controls, and meeting management. Built with Next.js 14, FastAPI, SQLAlchemy, and SQLite, it replicates the modern Zoom web client interface with persistent meeting scheduling and participant tracking.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS |
| **Backend** | FastAPI, Python 3, Uvicorn |
| **Database & ORM** | SQLite, SQLAlchemy 2.0, Pydantic |
| **Media APIs** | Web APIs (`getUserMedia`, `getDisplayMedia`) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- Python v3.10+ & pip

### Backend Setup (Local Port 8001)
```bash
cd backend
pip install -r requirements.txt
python ../database/seed.py
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Configure `frontend/.env.local`:
```env
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:8001

# Production (Vercel)
NEXT_PUBLIC_API_URL=https://zoomclone-videoconferencingplatform.onrender.com
```

## 🏗 Architecture Overview

```text
User
 ↓
Vercel Frontend (Next.js 14)
 ↓ HTTPS
Render FastAPI Backend
 ↓
SQLAlchemy ORM
 ↓
SQLite Database
```

```text
ZoomClone/
├── frontend/             # Next.js App Router UI & components
│   ├── app/              # Shell, /join/[code], and /meeting/[code] routes
│   ├── components/       # Header, Sidebar, Dashboard & MeetingRoom UI
│   └── lib/              # API client & screen share state bridge
├── backend/              # FastAPI REST service & Pydantic schemas
└── database/             # SQLite engine, models & database seeder
```

- **In-Shell Architecture**: Active meetings render within the main workspace shell without dismantling top header or left sidebar navigation.
- **Decoupled Backend**: Client communicates with FastAPI over REST endpoints; media capture runs locally via HTML5 Web APIs.

## 🗄 Database Schema

| Table | Columns | Relationship |
|---|---|---|
| **`meetings`** | `id` (PK), `meeting_code` (Unique), `title`, `description`, `host_name`, `meeting_type`, `scheduled_at`, `duration_minutes`, `status`, `invite_link`, `created_at`, `ended_at` | 1-to-Many with `participants` |
| **`participants`** | `id` (PK), `meeting_id` (FK), `name`, `is_host`, `joined_at` | Belongs to `meetings` |

## 📡 API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/meetings/instant` | Create a new instant meeting |
| `POST` | `/api/meetings/scheduled` | Schedule a future meeting |
| `GET` | `/api/meetings?status=upcoming\|recent` | Fetch upcoming or completed meetings |
| `GET` | `/api/meetings/{code}` | Retrieve meeting details by code |
| `POST` | `/api/meetings/{code}/join` | Add participant to a meeting |
| `POST` | `/api/meetings/{code}/end` | End meeting & mark status completed |

## 🎮 Core Features

- **Workspace Dashboard**: Live digital clock, action tiles (New Meeting, Join, Schedule), upcoming/recent meeting tabs, and calendar empty state.
- **In-Shell Meeting View**: Scoped meeting header, grid toggle, dark teal avatar fallback, and meeting info popover with invite copy.
- **Media Controls**: Local camera and microphone toggles via `getUserMedia` with device selection menus.
- **Screen Sharing**: Native window and screen streaming via `getDisplayMedia`.
- **In-Meeting Engagement**: Side drawers for active Participants and Chat, plus floating animated emoji reactions (`👏`, `👍`, `❤️`, `😂`, `😮`, `🎉`).

## 📝 Assumptions

- **Ephemeral Cloud Storage**: SQLite is used for local database storage; on free-tier Render hosting, database persistence resets on container restart.
- **Browser-Local Media Streams**: Media streaming relies on local browser Web APIs rather than a centralized WebRTC SFU media server.
- **Simplified Guest Auth**: Participants join with display names rather than full OAuth/JWT authentication.
