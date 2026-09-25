"use client";

import { useEffect, useRef, useState } from "react";

interface FloatingSelfViewProps {
  userName?: string;
  userInitial?: string;
}

export default function FloatingSelfView({
  userName = "Anshi Agrawal",
  userInitial = "A",
}: FloatingSelfViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        stream.getAudioTracks().forEach((t) => (t.enabled = false));
        setIsMuted(true);
        setHasCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (active) setHasCamera(false);
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function toggleAudio(e: React.MouseEvent) {
    e.stopPropagation();
    if (!streamRef.current) return;
    const nextState = !isMuted;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !nextState));
    setIsMuted(nextState);
  }

  function toggleVideo(e: React.MouseEvent) {
    e.stopPropagation();
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setHasCamera(videoTrack.enabled);
    }
  }

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-gray-300 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur transition hover:bg-gray-100"
        title="Show self-view"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-gray-700">{userName}</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 w-[184px] h-[114px] overflow-hidden rounded-xl border border-gray-800 bg-[#121214] shadow-2xl transition-all group select-none"
      aria-label="Floating self view"
    >
      {/* Video or Fallback Tile */}
      {hasCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover -scale-x-100"
        />
      ) : (
        /* Teal avatar tile matching the reference screenshot */
        <div className="flex h-full w-full items-center justify-center bg-[#121214]">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#004D40] text-xl font-medium text-white shadow-sm">
            {userInitial}
          </div>
        </div>
      )}

      {/* Name and red muted mic icon at bottom-left */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/70 px-1.5 py-0.5 backdrop-blur-xs">
        <button
          type="button"
          onClick={toggleAudio}
          className="text-white hover:text-white/80"
          title={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? (
            <svg className="h-3 w-3 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
              <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
              <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className="text-[10px] font-normal text-white/90 truncate max-w-[110px]">
          {userName}
        </span>
      </div>

      {/* Hover action overlay */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={toggleVideo}
          className="flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white/80 hover:text-white"
          title={hasCamera ? "Turn off camera" : "Turn on camera"}
        >
          {hasCamera ? (
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
              <path d="M21 21l-3.34-3.34L16 16.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.5l-3.34-3.34" />
              <path d="M16 12l7-5v10l-2.5-1.78" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMinimized(true)}
          className="flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white/80 hover:text-white"
          title="Minimize self view"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
