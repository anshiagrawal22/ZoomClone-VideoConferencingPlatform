const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  meeting_id: string;
  name: string;
  is_host: boolean;
  joined_at: string | null;
}

export interface Meeting {
  id: string;
  meeting_code: string;
  title: string;
  description: string | null;
  host_name: string;
  meeting_type: string;
  scheduled_at: string | null;
  duration_minutes: number;
  status: string;
  invite_link: string;
  created_at: string;
  ended_at: string | null;
  participants: Participant[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strips all non-digit characters from a meeting code or invite link,
 * returning just the 11-digit compact string the API expects.
 * Works for:
 *   "123 4567 8901"          → "12345678901"
 *   "http://…/join/12345678901" → "12345678901"
 */
export function compactMeetingCode(value: string): string {
  return value.replace(/\D/g, "");
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchMeetings(status: "upcoming" | "recent"): Promise<Meeting[]> {
  const res = await fetch(`${BASE}/api/meetings?status=${status}`);
  if (!res.ok) throw new Error(`fetchMeetings failed: ${res.status}`);
  return res.json();
}

export async function getMeeting(code: string): Promise<Meeting | null> {
  const res = await fetch(`${BASE}/api/meetings/${compactMeetingCode(code)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getMeeting failed: ${res.status}`);
  return res.json();
}

export async function createInstantMeeting(): Promise<Meeting> {
  const res = await fetch(`${BASE}/api/meetings/instant`, { method: "POST" });
  if (!res.ok) throw new Error(`createInstantMeeting failed: ${res.status}`);
  return res.json();
}

export async function createScheduledMeeting(body: {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
}): Promise<Meeting> {
  const res = await fetch(`${BASE}/api/meetings/scheduled`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`createScheduledMeeting failed: ${res.status}`);
  return res.json();
}

export async function joinMeeting(code: string, participantName: string): Promise<Meeting> {
  const res = await fetch(`${BASE}/api/meetings/${compactMeetingCode(code)}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_name: participantName }),
  });
  if (!res.ok) throw new Error(`joinMeeting failed: ${res.status}`);
  return res.json();
}

export async function endMeeting(code: string): Promise<Meeting> {
  const res = await fetch(`${BASE}/api/meetings/${compactMeetingCode(code)}/end`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`endMeeting failed: ${res.status}`);
  return res.json();
}
