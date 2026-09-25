"use client";

import { useEffect, useState } from "react";
import type { Meeting } from "@/lib/api";

interface DashboardHomeViewProps {
  meetings: Meeting[];
  loading: boolean;
  tab: "upcoming" | "recent";
  onTabChange: (tab: "upcoming" | "recent") => void;
  onNewMeeting: () => void;
  onJoinMeeting: () => void;
  onScheduleMeeting: () => void;
  onStartMeeting: (m: Meeting) => void;
  activeMeetingCode?: string | null;
  busy?: boolean;
}

export default function DashboardHomeView({
  meetings,
  loading,
  onNewMeeting,
  onJoinMeeting,
  onScheduleMeeting,
  onStartMeeting,
  activeMeetingCode,
}: DashboardHomeViewProps) {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  function copyInvite(m: Meeting) {
    const text = `${m.title}\nMeeting ID: ${m.meeting_code}\nJoin: ${m.invite_link}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 bg-white select-none">
      <div className="w-full max-w-[620px] flex flex-col items-center">
        {/* ── Digital Clock & Date ────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[44px] sm:text-[50px] font-normal tracking-tight text-[#111827] tabular-nums leading-tight">
            {timeStr || "12:32 AM"}
          </h1>
          <p className="mt-0.5 text-xs sm:text-[13px] text-[#6B7280]">
            {dateStr || "Saturday, September 26"}
          </p>
        </div>

        {/* ── 3 Action Buttons Row: Back to Meeting, Join, Schedule ──────── */}
        <div className="mt-7 flex items-center justify-center gap-9 sm:gap-11">
          {/* Button 1: Back to Meeting (or New Meeting if no active meeting) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              id="btn-back-meeting"
              onClick={onNewMeeting}
              className="flex h-[56px] w-[56px] sm:h-[60px] sm:w-[60px] items-center justify-center rounded-full bg-[#FF6A00] text-white shadow-sm hover:brightness-105 active:scale-95 transition"
              title={activeMeetingCode ? "Back to Meeting" : "New Meeting"}
            >
              {activeMeetingCode ? (
                /* Curving back arrow */
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              ) : (
                /* Video camera icon */
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 3.5v-10l-4 3.5z" />
                </svg>
              )}
            </button>
            <span className="mt-2 text-[11px] text-[#4B5563]">
              {activeMeetingCode ? "Back to Meeting" : "New Meeting"}
            </span>
          </div>

          {/* Button 2: Join (Lavender rounded square with plus) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              id="btn-join"
              onClick={onJoinMeeting}
              className="flex h-[56px] w-[56px] sm:h-[60px] sm:w-[60px] items-center justify-center rounded-2xl bg-[#D6E4FF] text-[#0B5CFF] shadow-sm hover:brightness-95 active:scale-95 transition"
              title="Join Meeting"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[#0B5CFF] shadow-2xs">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
              </div>
            </button>
            <span className="mt-2 text-[11px] text-[#4B5563]">Join</span>
          </div>

          {/* Button 3: Schedule (Blue rounded square with calendar date 19) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              id="btn-schedule"
              onClick={onScheduleMeeting}
              className="flex h-[56px] w-[56px] sm:h-[60px] sm:w-[60px] items-center justify-center rounded-2xl bg-[#0B5CFF] text-white shadow-sm hover:bg-[#004FE0] active:scale-95 transition"
              title="Schedule Meeting"
            >
              <div className="flex flex-col items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="3" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
                <span className="text-[10px] font-bold leading-none -mt-3.5">19</span>
              </div>
            </button>
            <span className="mt-2 text-[11px] text-[#4B5563]">Schedule</span>
          </div>
        </div>

        {/* ── 3 Rounded Cards: Recordings, Summaries, My Notes ────────────── */}
        <div className="mt-7 grid grid-cols-3 gap-3 w-full">
          {/* Recordings */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-white px-3.5 py-3 shadow-xs hover:border-gray-300 transition cursor-pointer">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="3.5" />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#111827] truncate">Recordings</span>
          </div>

          {/* Summaries */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-white px-3.5 py-3 shadow-xs hover:border-gray-300 transition cursor-pointer">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#111827] truncate">Summaries</span>
          </div>

          {/* My Notes */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200/90 bg-white px-3.5 py-3 shadow-xs hover:border-gray-300 transition cursor-pointer">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-[#111827] truncate">My Notes</span>
          </div>
        </div>

        {/* ── Info Banner: You haven't connected your calendar yet ────────── */}
        <div className="mt-5 w-full rounded-2xl border border-blue-200/80 bg-white p-3.5 shadow-xs flex items-center gap-3">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#0B5CFF]">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-[12px] text-[#4B5563] leading-relaxed">
            You haven&apos;t connected your calendar yet.{" "}
            <button
              type="button"
              onClick={() => alert("Calendar integration")}
              className="text-[#0B5CFF] hover:underline font-normal inline"
            >
              Connect now
            </button>{" "}
            to manage all your meetings and events in one place.
          </p>
        </div>

        {/* ── Calendar Section ─────────────────────────────────────────────── */}
        <div className="mt-6 w-full flex flex-col">
          {/* Header Row: "Today, Sep 26 v" and external link icon */}
          <div className="flex items-center justify-between pb-2 px-1">
            <div className="flex-1 flex justify-center items-center gap-1.5 cursor-pointer">
              <span className="text-[13px] font-semibold text-[#111827]">Today, Sep 26</span>
              <svg className="h-3.5 w-3.5 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <button
              type="button"
              className="text-[#6B7280] hover:text-[#111827] transition"
              title="Open calendar in new tab"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* Boxed Calendar Card */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs relative">
            {/* Top sub-row inside card: Today pill, < >, ... */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-gray-300 px-2.5 py-0.5 text-[11px] font-normal text-gray-700 hover:bg-gray-50 transition"
                >
                  <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Today</span>
                </button>

                <div className="flex items-center text-gray-500">
                  <button type="button" className="p-0.5 hover:text-gray-900" title="Previous">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="p-0.5 hover:text-gray-900" title="Next">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Three dots overflow menu */}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700"
                title="Calendar options"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="6" cy="12" r="1.5" />
                  <circle cx="18" cy="12" r="1.5" />
                </svg>
              </button>
            </div>

            {/* Card Body: Empty state illustration or real scheduled meetings */}
            <div className="relative min-h-[170px] flex flex-col items-center justify-center p-6">
              {loading ? (
                <div className="flex items-center text-xs text-gray-400">
                  <div className="h-4 w-4 border-2 border-[#0B5CFF] border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </div>
              ) : meetings.length === 0 ? (
                /* Empty state matching the beach umbrella reference illustration */
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative mb-3">
                    <svg className="h-24 w-28" viewBox="0 0 120 90" fill="none">
                      {/* Lavender & Lilac Beach Umbrella */}
                      <path
                        d="M60 14C45 14 32 30 30 38H90C88 30 75 14 60 14Z"
                        fill="#C7D2FE"
                      />
                      <path
                        d="M50 15C42 21 35 29 33 38H45C45 29 47 21 50 15Z"
                        fill="#A5B4FC"
                      />
                      <path
                        d="M70 15C78 21 85 29 87 38H75C75 29 73 21 70 15Z"
                        fill="#A5B4FC"
                      />
                      {/* Umbrella pole */}
                      <line x1="60" y1="38" x2="60" y2="70" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Soft shadow / sand */}
                      <ellipse cx="60" cy="72" rx="32" ry="5" fill="#EEF2F6" />
                      {/* Beach towel / chair */}
                      <path d="M68 64L82 66L80 71L66 69Z" fill="#CBD5E1" />
                      <line x1="69" y1="65" x2="81" y2="67" stroke="#94A3B8" strokeWidth="1" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-[#6B7280] font-normal">
                    No meetings scheduled.
                  </p>
                </div>
              ) : (
                /* Real scheduled meetings */
                <div className="w-full space-y-2.5">
                  {meetings.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F9FAFB] p-3 text-xs"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{m.title}</h4>
                        <p className="text-[11px] text-gray-500 font-mono">
                          ID: {m.meeting_code} • Host: {m.host_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyInvite(m)}
                          className="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-50"
                        >
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onStartMeeting(m)}
                          className="rounded bg-[#0B5CFF] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#004FE0]"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vertical scrollbar indicator right border */}
              <div className="absolute right-1 top-2 bottom-2 w-1 rounded-full bg-gray-200/50" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Carousel Right Chevron pinned to right edge ─────────────────────── */}
      <button
        type="button"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-6 items-center justify-center rounded-lg bg-gray-100/80 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
        title="Next view"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
