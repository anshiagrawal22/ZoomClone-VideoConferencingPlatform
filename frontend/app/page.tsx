"use client";

import { useCallback, useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppSidebar, { type NavTab } from "@/components/AppSidebar";
import DashboardHomeView from "@/components/DashboardHomeView";
import ChatView from "@/components/ChatView";
import MeetingsView from "@/components/MeetingsView";
import ContactsView from "@/components/ContactsView";
import FloatingSelfView from "@/components/FloatingSelfView";
import MeetingRoom from "@/components/MeetingRoom";
import JoinMeetingModal from "@/components/JoinMeetingModal";
import NewMeetingModal from "@/components/NewMeetingModal";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";
import {
  compactMeetingCode,
  createInstantMeeting,
  fetchMeetings,
  getMeeting,
  joinMeeting,
  type Meeting,
} from "@/lib/api";

export default function MainPage() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  // Active meeting state (renders inside Home tab when active)
  const [activeMeetingCode, setActiveMeetingCode] = useState<string | null>(null);
  const [meetingSelfName, setMeetingSelfName] = useState("Anshi Agrawal");
  const [isMeetingViewOpen, setIsMeetingViewOpen] = useState(false);

  // Dashboard meeting list state
  const [meetingTab, setMeetingTab] = useState<"upcoming" | "recent">("upcoming");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [newOpen, setNewOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Load meetings
  const loadMeetings = useCallback(async (tab: "upcoming" | "recent") => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeetings(tab);
      setMeetings(data);
    } catch {
      setError("Could not load meetings. Is the backend running on port 8000?");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings(meetingTab);
  }, [meetingTab, loadMeetings]);

  // ── Action Handlers ────────────────────────────────────────────────────────

  /** Start instant meeting inside Home shell */
  async function confirmInstant() {
    setBusy(true);
    try {
      const meeting = await createInstantMeeting();
      const code = compactMeetingCode(meeting.meeting_code);
      await joinMeeting(code, meetingSelfName);
      setActiveMeetingCode(code);
      setIsMeetingViewOpen(true);
      setActiveTab("home");
      setNewOpen(false);
    } catch {
      setError("Could not start instant meeting. Is backend running?");
    } finally {
      setBusy(false);
    }
  }

  /** Join existing meeting */
  async function submitJoin(codeOrLink: string, name: string) {
    setBusy(true);
    setJoinError(null);
    const code = compactMeetingCode(codeOrLink);
    try {
      const meeting = await getMeeting(code);
      if (!meeting) {
        setJoinError("Invalid meeting ID. Please check and try again.");
        setBusy(false);
        return;
      }
      const participantName = name.trim() || meetingSelfName;
      await joinMeeting(code, participantName);
      setMeetingSelfName(participantName);
      setActiveMeetingCode(code);
      setIsMeetingViewOpen(true);
      setActiveTab("home");
      setJoinOpen(false);
    } catch {
      setJoinError("Invalid meeting ID. Please check and try again.");
    } finally {
      setBusy(false);
    }
  }

  /** Start meeting card */
  async function handleStartCard(m: Meeting) {
    setBusy(true);
    try {
      const code = compactMeetingCode(m.meeting_code);
      await joinMeeting(code, meetingSelfName);
      setActiveMeetingCode(code);
      setIsMeetingViewOpen(true);
      setActiveTab("home");
    } catch {
      setError("Could not start this meeting.");
    } finally {
      setBusy(false);
    }
  }

  /** End meeting inside shell */
  function handleMeetingEnded() {
    setActiveMeetingCode(null);
    setIsMeetingViewOpen(false);
    loadMeetings("recent");
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      {/* ── Top full-width navbar (persists across all views including in-meeting) ── */}
      <AppHeader userName={meetingSelfName} userInitial="A" />

      {/* ── Main body: Left Sidebar + Scoped Content Area ─────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (persists across all views including in-meeting) */}
        <AppSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          onOpenSettings={() => alert("Zoom Workplace settings")}
        />

        {/* ── Scoped Content Area (Right of sidebar, below top navbar) ─────── */}
        <div className="relative flex flex-1 overflow-hidden bg-white">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 shadow-md">
              {error}
            </div>
          )}

          {/* HOME TAB: Displays MeetingRoom when in a meeting, or DashboardHomeView when not */}
          {activeTab === "home" && (
            isMeetingViewOpen && activeMeetingCode ? (
              /* Screen 2: In-meeting view scoped inside Home shell */
              <MeetingRoom
                code={activeMeetingCode}
                selfName={meetingSelfName}
                userInitial="A"
                onEndMeeting={handleMeetingEnded}
              />
            ) : (
              /* Screen 1: Dashboard Home view */
              <DashboardHomeView
                meetings={meetings}
                loading={loading}
                tab={meetingTab}
                onTabChange={setMeetingTab}
                onNewMeeting={() => {
                  if (activeMeetingCode) {
                    setIsMeetingViewOpen(true);
                  } else {
                    setNewOpen(true);
                  }
                }}
                onJoinMeeting={() => {
                  setJoinError(null);
                  setJoinOpen(true);
                }}
                onScheduleMeeting={() => setScheduleOpen(true)}
                onStartMeeting={handleStartCard}
                activeMeetingCode={activeMeetingCode}
                busy={busy}
              />
            )
          )}

          {/* CHAT TAB (accessible even during an active meeting) */}
          {activeTab === "chat" && <ChatView />}

          {/* MEETINGS TAB */}
          {activeTab === "meetings" && (
            <MeetingsView
              onStartMeeting={(code) => {
                const compact = compactMeetingCode(code);
                joinMeeting(compact, meetingSelfName).then(() => {
                  setActiveMeetingCode(compact);
                  setIsMeetingViewOpen(true);
                  setActiveTab("home");
                });
              }}
              onOpenSchedule={() => setScheduleOpen(true)}
            />
          )}

          {/* CONTACTS TAB */}
          {activeTab === "contacts" && <ContactsView />}
        </div>
      </div>

      {/* ── Floating Self-View (Only shown on non-meeting views) ─────────────── */}
      {!(activeTab === "home" && isMeetingViewOpen && activeMeetingCode) && (
        <FloatingSelfView userName={meetingSelfName} userInitial="A" />
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <NewMeetingModal
        open={newOpen}
        busy={busy}
        onCancel={() => !busy && setNewOpen(false)}
        onConfirm={confirmInstant}
      />

      <JoinMeetingModal
        open={joinOpen}
        busy={busy}
        error={joinError}
        onCancel={() => {
          if (!busy) {
            setJoinOpen(false);
            setJoinError(null);
          }
        }}
        onSubmit={submitJoin}
      />

      <ScheduleMeetingModal
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        onScheduled={() => {
          setScheduleOpen(false);
          setMeetingTab("upcoming");
          loadMeetings("upcoming");
        }}
      />
    </div>
  );
}
