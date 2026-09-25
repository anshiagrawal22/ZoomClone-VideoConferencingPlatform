from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class ParticipantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    meeting_id: str
    name: str
    is_host: bool
    joined_at: Optional[datetime] = None


class MeetingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    meeting_code: str
    title: str
    description: Optional[str] = None
    host_name: str
    meeting_type: str
    scheduled_at: Optional[datetime] = None
    duration_minutes: int
    status: str
    invite_link: str
    created_at: datetime
    ended_at: Optional[datetime] = None
    participants: list[ParticipantOut] = []


class ScheduledMeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int = Field(default=30, ge=1)


class JoinMeetingBody(BaseModel):
    participant_name: str = Field(min_length=1)


StatusFilter = Literal["upcoming", "recent"]
