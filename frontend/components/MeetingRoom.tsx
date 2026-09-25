"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { compactMeetingCode, endMeeting, getMeeting, type Participant } from "@/lib/api";
import { consumePendingScreenStream } from "@/lib/screenShareState";
import MeetingInfoPopover from "@/components/MeetingInfoPopover";

interface MeetingRoomProps {
  code: string;
  selfName?: string;
  userInitial?: string;
  autoShare?: boolean;
  onEndMeeting?: () => void;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  left: number;
}

export default function MeetingRoom({
  code,
  selfName = "Anshi Agrawal",
  userInitial = "A",
  autoShare = false,
  onEndMeeting,
}: MeetingRoomProps) {
  const compact = compactMeetingCode(code);

  // Media refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // State
  const [title, setTitle] = useState(`${selfName}'s Zoom Meeting`);
  const [meetingCodeLabel, setMeetingCodeLabel] = useState(code);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hasMedia, setHasMedia] = useState(false);
  const [micOn, setMicOn] = useState(false); // start muted per screenshot
  const [camOn, setCamOn] = useState(false); // start cam off per screenshot
  const [isSharing, setIsSharing] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(true);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [panel, setPanel] = useState<"none" | "participants" | "chat">("none");
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [inMeetingChat, setInMeetingChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "System", text: "Welcome to the meeting!", time: "Just now" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Load meeting metadata
  useEffect(() => {
    let active = true;
    getMeeting(compact)
      .then((m) => {
        if (!active || !m) return;
        setTitle(m.title || `${selfName}'s Zoom Meeting`);
        setMeetingCodeLabel(m.meeting_code);
        setParticipants(m.participants || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [compact, selfName]);

  // Camera & Mic initialization
  async function requestMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setHasMedia(true);
      setMicOn(true);
      setCamOn(true);
      setShowWarningBanner(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setHasMedia(false);
      setMicOn(false);
      setCamOn(false);
    }
  }

  useEffect(() => {
    // Attempt to access devices
    requestMedia();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Sync video element
  useEffect(() => {
    if (hasMedia && camOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [hasMedia, camOn]);

  // Sync screen video element
  useEffect(() => {
    if (isSharing && screenRef.current && screenStreamRef.current) {
      screenRef.current.srcObject = screenStreamRef.current;
    }
  }, [isSharing]);

  // Auto share stream if present
  useEffect(() => {
    if (!autoShare) return;
    const stream = consumePendingScreenStream();
    if (!stream) return;
    screenStreamRef.current = stream;
    setIsSharing(true);
    stream.getVideoTracks()[0]?.addEventListener("ended", () => {
      screenStreamRef.current = null;
      setIsSharing(false);
    });
  }, [autoShare]);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Media toggles
  function toggleMic() {
    if (!streamRef.current) {
      requestMedia();
      return;
    }
    const next = !micOn;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  }

  function toggleCam() {
    if (!streamRef.current) {
      requestMedia();
      return;
    }
    const next = !camOn;
    streamRef.current.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamOn(next);
  }

  // Screen share toggle
  async function toggleShareScreen() {
    if (isSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsSharing(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      screenStreamRef.current = stream;
      setIsSharing(true);
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        screenStreamRef.current = null;
        setIsSharing(false);
      });
    } catch {
      setToast("Screen share cancelled or permission denied.");
    }
  }

  function sendReaction(emoji: string) {
    const reaction: FloatingReaction = {
      id: Math.random().toString(),
      emoji,
      left: 30 + Math.random() * 40,
    };
    setFloatingReactions((prev) => [...prev, reaction]);
    setShowReactionsMenu(false);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 2000);
  }

  function handleSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setInMeetingChat((prev) => [
      ...prev,
      {
        sender: selfName,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setChatInput("");
  }

  async function handleEnd() {
    setEnding(true);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      await endMeeting(compact);
    } catch {
      /* continue */
    }
    if (onEndMeeting) {
      onEndMeeting();
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-[#0D0D0E] text-white overflow-hidden select-none">
      {/* ── Meeting Header Bar (Dark, Scoped to Content Area) ─────────────── */}
      <header className="relative z-30 flex h-10 shrink-0 items-center justify-between bg-[#121214] px-4 text-xs border-b border-white/5">
        {/* Left: Info icon + Title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setShowInfoPopover(!showInfoPopover)}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-white/90 hover:bg-white/10 transition"
            title="Meeting Information"
          >
            <span className="text-[10px] font-bold">i</span>
          </button>
          <span className="truncate font-medium text-white/90 text-xs">{title}</span>

          <MeetingInfoPopover
            title={title}
            meetingCode={meetingCodeLabel}
            hostName={`${selfName} (Host)`}
            isOpen={showInfoPopover}
            onClose={() => setShowInfoPopover(false)}
          />
        </div>

        {/* Right: verified shield, pencil, sparkle AI, grid, zm badge */}
        <div className="flex items-center gap-3 text-white/80">
          {/* Green verified shield */}
          <button type="button" className="text-[#10B981] hover:opacity-80" title="Encryption Verified">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.68 2 6.348 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.652-.056-1.32-.166-2.001A11.954 11.954 0 0110 1.944zm3.707 6.763a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Pencil / Annotate icon */}
          <button type="button" className="hover:text-white" title="Annotate">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          {/* Sparkle AI Companion */}
          <button type="button" className="text-white hover:text-indigo-400" title="AI Companion">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
            </svg>
          </button>

          {/* Grid View */}
          <button type="button" className="hover:text-white" title="View">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>

          {/* zm pill badge */}
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-semibold text-white">
            zm
          </span>
        </div>
      </header>

      {/* ── Main Canvas Viewport ─────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 flex-col items-center justify-center p-3 overflow-hidden bg-[#0D0D0E]">
          {/* Amber Warning Banner near top of video canvas */}
          {showWarningBanner && (!camOn || !micOn) && (
            <div className="absolute top-4 z-30 flex items-center gap-2 rounded-full bg-[#18181B]/95 border border-amber-500/40 px-4 py-1.5 text-xs text-white/90 shadow-xl backdrop-blur-md">
              <svg className="h-3.5 w-3.5 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Please enable access to your{" "}
                <button
                  type="button"
                  onClick={requestMedia}
                  className="underline text-blue-400 font-medium hover:text-blue-300"
                >
                  microphone
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={requestMedia}
                  className="underline text-blue-400 font-medium hover:text-blue-300"
                >
                  camera
                </button>{" "}
                for the best experience.
              </span>
              <button
                type="button"
                onClick={() => setShowWarningBanner(false)}
                className="ml-2 text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Floating emoji reactions */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
            {floatingReactions.map((r) => (
              <span
                key={r.id}
                className="absolute text-4xl animate-bounce"
                style={{
                  left: `${r.left}%`,
                  bottom: "70px",
                  transition: "all 2s ease-out",
                }}
              >
                {r.emoji}
              </span>
            ))}
          </div>

          {/* Screen Share or Local Canvas */}
          {isSharing ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center">
              <video
                ref={screenRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-contain rounded-xl"
              />
              <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sharing Screen
              </div>
            </div>
          ) : (
            /* Centered Square Tile matching reference screenshot */
            <div className="relative flex h-full w-full items-center justify-center">
              {hasMedia && camOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-[85vh] max-w-[90vw] rounded-2xl object-cover -scale-x-100 shadow-2xl"
                />
              ) : (
                /* Dark Teal initial tile "A" matching Screenshot 2 */
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-none bg-[#004D40] text-4xl sm:text-5xl font-normal text-white shadow-2xl">
                    {userInitial}
                  </div>
                </div>
              )}

              {/* Local Participant name tag pinned to bottom-left */}
              <div className="absolute bottom-4 left-6 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-xs">
                {!micOn && (
                  <svg className="h-3 w-3 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
                    <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
                  </svg>
                )}
                <span>{selfName}</span>
              </div>
            </div>
          )}

          {/* Right edge carousel button */}
          <button
            type="button"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-6 items-center justify-center rounded-md bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition"
            title="Next participant page"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Side Panels (Participants / Chat) ────────────────────────────── */}
        {panel !== "none" && (
          <aside className="w-72 border-l border-white/10 bg-[#18181B] flex flex-col shrink-0">
            <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 text-xs font-semibold capitalize">
              <span>{panel}</span>
              <button
                type="button"
                onClick={() => setPanel("none")}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {panel === "participants" ? (
              <div className="flex-1 overflow-y-auto p-3 text-xs space-y-2">
                <div className="text-white/50 text-[11px] pb-1 border-b border-white/10">
                  In Meeting ({participants.length + 1})
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#004D40] text-[10px] font-bold text-white">
                      {userInitial}
                    </div>
                    <span>{selfName} (Host, Me)</span>
                  </div>
                  <span className="text-xs">{micOn ? "🎙️" : "🔇"}</span>
                </div>
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-1">
                    <span>{p.name}</span>
                    <span className="text-xs">🎙️</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col">
                <div className="flex-1 overflow-y-auto p-3 text-xs space-y-2">
                  {inMeetingChat.map((m, i) => (
                    <div key={i} className="rounded bg-white/5 p-2">
                      <div className="text-[10px] text-white/50 flex justify-between">
                        <span className="font-semibold">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="mt-1 text-white/90">{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="border-t border-white/10 p-2 flex gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 rounded bg-white/10 px-2 py-1 text-xs text-white placeholder-white/40 outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded bg-[#0B5CFF] px-2.5 py-1 text-xs font-semibold text-white"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ── Toast notification ────────────────────────────────────────────── */}
      {toast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-black/90 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur">
          {toast}
        </div>
      )}

      {/* ── Bottom Control Bar: Exact Parity with Reference ───────────────── */}
      <footer className="relative z-30 flex h-[62px] shrink-0 items-center justify-between bg-black px-4 sm:px-6 border-t border-white/10">
        {/* Left Cluster: Audio & Video */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Audio button: Mic icon + small chevron + Audio label */}
          <div className="relative flex flex-col items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-1 transition ${
                  micOn ? "text-white" : "text-[#EF4444]"
                }`}
                title={micOn ? "Mute" : "Unmute"}
              >
                {micOn ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
                    <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
                    <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="text-white/60 hover:text-white -ml-0.5"
                title="Select Microphone"
              >
                <svg className="h-2.5 w-2.5" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M5 0L10 5L9 6L5 2L1 6L0 5L5 0Z" />
                </svg>
              </button>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">Audio</span>

            {showAudioMenu && (
              <div className="absolute bottom-14 left-0 w-52 rounded-lg border border-white/10 bg-[#1E1E22] p-2 text-xs shadow-2xl">
                <div className="text-[10px] text-white/40 uppercase font-semibold px-2 py-0.5">Microphone</div>
                <div className="rounded px-2 py-1 text-emerald-400">✓ Default - Built-in Mic</div>
                <div className="mt-1.5 text-[10px] text-white/40 uppercase font-semibold px-2 py-0.5">Speaker</div>
                <div className="rounded px-2 py-1 text-emerald-400">✓ Built-in Output</div>
              </div>
            )}
          </div>

          {/* Video button: Camera icon + small chevron + Video label */}
          <div className="relative flex flex-col items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleCam}
                className={`p-1 transition ${
                  camOn ? "text-white" : "text-[#EF4444]"
                }`}
                title={camOn ? "Stop Video" : "Start Video"}
              >
                {camOn ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                    <path d="M21 21l-3.34-3.34L16 16.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.5l-3.34-3.34" />
                    <path d="M16 12l7-5v10l-2.5-1.78" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowVideoMenu(!showVideoMenu)}
                className="text-white/60 hover:text-white -ml-0.5"
                title="Select Camera"
              >
                <svg className="h-2.5 w-2.5" viewBox="0 0 10 6" fill="currentColor">
                  <path d="M5 0L10 5L9 6L5 2L1 6L0 5L5 0Z" />
                </svg>
              </button>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">Video</span>

            {showVideoMenu && (
              <div className="absolute bottom-14 left-0 w-48 rounded-lg border border-white/10 bg-[#1E1E22] p-2 text-xs shadow-2xl">
                <div className="text-[10px] text-white/40 uppercase font-semibold px-2 py-0.5">Camera</div>
                <div className="rounded px-2 py-1 text-emerald-400">✓ FaceTime HD Camera</div>
              </div>
            )}
          </div>
        </div>

        {/* Center Cluster: Participants, Chat, React, Share, More (NO Host tools!) */}
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Participants */}
          <button
            type="button"
            onClick={() => setPanel(panel === "participants" ? "none" : "participants")}
            className="flex flex-col items-center p-1 text-white/80 hover:text-white transition"
          >
            <div className="flex items-center gap-0.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-[11px] font-bold text-white/90">1</span>
              <svg className="h-2 w-2 text-white/60 ml-0.5" viewBox="0 0 10 6" fill="currentColor">
                <path d="M5 0L10 5L9 6L5 2L1 6L0 5L5 0Z" />
              </svg>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">Participants</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={() => setPanel(panel === "chat" ? "none" : "chat")}
            className="flex flex-col items-center p-1 text-white/80 hover:text-white transition"
          >
            <div className="flex items-center gap-0.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4m-7 6l2.5-2.5H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h.5L5 20z" />
              </svg>
              <svg className="h-2 w-2 text-white/60 ml-0.5" viewBox="0 0 10 6" fill="currentColor">
                <path d="M5 0L10 5L9 6L5 2L1 6L0 5L5 0Z" />
              </svg>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">Chat</span>
          </button>

          {/* React (heart outline icon, label React, no chevron) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReactionsMenu(!showReactionsMenu)}
              className="flex flex-col items-center p-1 text-white/80 hover:text-white transition"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-[10px] text-white/90 leading-tight">React</span>
            </button>

            {showReactionsMenu && (
              <div className="absolute bottom-14 -left-12 flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#1E1E22] p-1.5 shadow-2xl backdrop-blur-md">
                {["👏", "👍", "❤️", "😂", "😮", "🎉"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => sendReaction(emoji)}
                    className="p-1 text-lg hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share: screen with upward arrow [^] + small upward chevron */}
          <button
            type="button"
            onClick={toggleShareScreen}
            className="flex flex-col items-center p-1 text-white/80 hover:text-white transition"
          >
            <div className="flex items-center gap-0.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l4 4m-4-4l-4 4m4-4v8" />
              </svg>
              <svg className="h-2 w-2 text-white/60 ml-0.5" viewBox="0 0 10 6" fill="currentColor">
                <path d="M5 0L10 5L9 6L5 2L1 6L0 5L5 0Z" />
              </svg>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">Share</span>
          </button>

          {/* More: ••• + label More */}
          <button
            type="button"
            className="flex flex-col items-center p-1 text-white/80 hover:text-white transition"
          >
            <div className="flex h-5 items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="6" cy="12" r="1.8" />
                <circle cx="18" cy="12" r="1.8" />
              </svg>
            </div>
            <span className="text-[10px] text-white/90 leading-tight">More</span>
          </button>
        </div>

        {/* Right Cluster: End button (Solid red circular button with white X icon, NO label text) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleEnd}
            disabled={ending}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EF4444] text-white hover:bg-red-600 active:scale-95 shadow-md transition"
            title="End Meeting"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
