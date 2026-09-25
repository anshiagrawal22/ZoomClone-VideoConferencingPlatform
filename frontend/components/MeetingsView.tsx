"use client";

import { useEffect, useState } from "react";
import { fetchMeetings, type Meeting } from "@/lib/api";

interface MeetingsViewProps {
  onStartMeeting: (code: string) => void;
  onOpenSchedule: () => void;
}

export default function MeetingsView({ onStartMeeting, onOpenSchedule }: MeetingsViewProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "recorded">("upcoming");

  useEffect(() => {
    setLoading(true);
    fetchMeetings("upcoming")
      .then((data) => setMeetings(data))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full w-full bg-[#F8F9FA] overflow-y-auto p-6 sm:p-8">
      <div className="mx-auto max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Meetings &amp; Events</h1>
            <p className="text-xs text-gray-500 mt-1">Manage scheduled calls, recurring rooms, and recordings</p>
          </div>
          <button
            type="button"
            onClick={onOpenSchedule}
            className="flex items-center gap-2 rounded-xl bg-[#0B5CFF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#004FE0] transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            Schedule a Meeting
          </button>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              filter === "upcoming" ? "bg-white text-[#0B5CFF] shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilter("recorded")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              filter === "recorded" ? "bg-white text-[#0B5CFF] shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Recorded
          </button>
        </div>

        {/* Content list */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-xs text-gray-500">
              Loading scheduled meetings...
            </div>
          ) : meetings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0B5CFF] mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">No scheduled meetings</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Schedule a meeting to share with teammates or integrate your calendar for automatic sync.
              </p>
              <button
                type="button"
                onClick={onOpenSchedule}
                className="mt-4 rounded-lg bg-[#0B5CFF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#004FE0]"
              >
                Schedule Now
              </button>
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs hover:border-[#0B5CFF]/40 transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{m.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ID: {m.meeting_code} • {m.duration_minutes} min • Host: {m.host_name}
                  </p>
                  {m.scheduled_at && (
                    <span className="inline-block mt-2 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#0B5CFF]">
                      {new Date(m.scheduled_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(m.invite_link)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartMeeting(m.meeting_code)}
                    className="rounded-lg bg-[#0B5CFF] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#004FE0]"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
