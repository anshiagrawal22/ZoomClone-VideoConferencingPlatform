import random
import re
import sys
from datetime import datetime
from pathlib import Path

# Add project root to sys.path so 'database' package can be imported
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, text
from sqlalchemy.orm import Session, joinedload

from database import Base, engine, get_db, Meeting, Participant

try:
    from .schemas import JoinMeetingBody, MeetingOut, ScheduledMeetingCreate, StatusFilter
except ImportError:
    from schemas import JoinMeetingBody, MeetingOut, ScheduledMeetingCreate, StatusFilter




ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    cols = {row[1] for row in conn.execute(text("PRAGMA table_info(meetings)")).fetchall()}
    if "ended_at" not in cols:
        conn.execute(text("ALTER TABLE meetings ADD COLUMN ended_at DATETIME"))
        conn.commit()

app = FastAPI(title="Zoom Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_code(code: str) -> str:
    return re.sub(r"\D", "", code)


def format_meeting_code(digits: str) -> str:
    """Zoom-style 11-digit personal meeting ID: 123 4567 8901"""
    d = digits[:11]
    return f"{d[0:3]} {d[3:7]} {d[7:11]}"


def generate_unique_code(db: Session) -> str:
    for _ in range(50):
        digits = "".join(str(random.randint(0, 9)) for _ in range(11))
        formatted = format_meeting_code(digits)
        exists = db.query(Meeting).filter(Meeting.meeting_code == formatted).first()
        if not exists:
            return formatted
    raise HTTPException(status_code=500, detail="Could not generate a unique meeting code")


def build_invite_link(meeting_code: str) -> str:
    compact = normalize_code(meeting_code)
    return f"{ALLOWED_ORIGINS[0]}/join/{compact}"


def get_meeting_by_code(db: Session, meeting_code: str) -> Meeting | None:
    compact = normalize_code(meeting_code)
    if not compact:
        return None
    return (
        db.query(Meeting)
        .options(joinedload(Meeting.participants))
        .filter(func.replace(Meeting.meeting_code, " ", "") == compact)
        .first()
    )


@app.post("/api/meetings/instant", response_model=MeetingOut)
def create_instant_meeting(db: Session = Depends(get_db)):
    code = generate_unique_code(db)
    meeting = Meeting(
        meeting_code=code,
        title="Instant Meeting",
        description=None,
        host_name="You",
        meeting_type="instant",
        scheduled_at=None,
        duration_minutes=30,
        status="upcoming",
        invite_link=build_invite_link(code),
        created_at=datetime.utcnow(),
        ended_at=None,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@app.post("/api/meetings/scheduled", response_model=MeetingOut)
def create_scheduled_meeting(body: ScheduledMeetingCreate, db: Session = Depends(get_db)):
    code = generate_unique_code(db)
    meeting = Meeting(
        meeting_code=code,
        title=body.title,
        description=body.description,
        host_name="You",
        meeting_type="scheduled",
        scheduled_at=body.scheduled_at.replace(tzinfo=None) if body.scheduled_at.tzinfo else body.scheduled_at,
        duration_minutes=body.duration_minutes,
        status="upcoming",
        invite_link=build_invite_link(code),
        created_at=datetime.utcnow(),
        ended_at=None,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@app.get("/api/meetings", response_model=list[MeetingOut])
def list_meetings(
    status: StatusFilter = Query(...),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    if status == "recent":
        return (
            db.query(Meeting)
            .options(joinedload(Meeting.participants))
            .filter(Meeting.status == "completed")
            .order_by(Meeting.ended_at.desc())
            .all()
        )

    return (
        db.query(Meeting)
        .options(joinedload(Meeting.participants))
        .filter(
            Meeting.meeting_type == "scheduled",
            Meeting.status == "upcoming",
            Meeting.scheduled_at.isnot(None),
            Meeting.scheduled_at > now,
        )
        .order_by(Meeting.scheduled_at.asc())
        .all()
    )


@app.get("/api/meetings/{meeting_code}", response_model=MeetingOut)
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@app.post("/api/meetings/{meeting_code}/join", response_model=MeetingOut)
def join_meeting(meeting_code: str, body: JoinMeetingBody, db: Session = Depends(get_db)):
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    name = body.participant_name.strip()
    is_host = len(meeting.participants) == 0 or name.lower() == meeting.host_name.lower()

    participant = Participant(
        meeting_id=meeting.id,
        name=name,
        is_host=is_host,
        joined_at=datetime.utcnow(),
    )
    db.add(participant)

    if meeting.meeting_type == "instant" and meeting.status == "upcoming":
        meeting.status = "live"

    db.commit()
    meeting = get_meeting_by_code(db, meeting_code)
    return meeting


@app.post("/api/meetings/{meeting_code}/end", response_model=MeetingOut)
def end_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = get_meeting_by_code(db, meeting_code)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = "completed"
    meeting.ended_at = datetime.utcnow()
    db.commit()
    meeting = get_meeting_by_code(db, meeting_code)
    return meeting
