"use client";

import { useState } from "react";

interface MeetingInfoPopoverProps {
  title: string;
  meetingCode: string;
  hostName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingInfoPopover({
  title,
  meetingCode,
  hostName,
  isOpen,
  onClose,
}: MeetingInfoPopoverProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/join/${meetingCode.replace(/\D/g, "")}`
    : `http://localhost:3000/join/${meetingCode.replace(/\D/g, "")}`;

  function handleCopy() {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="absolute top-12 left-4 z-50 w-80 rounded-2xl border border-gray-700/80 bg-[#1F2024]/95 p-4 text-white shadow-2xl backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-3 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-gray-200">Meeting Info</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-3 space-y-2.5 text-xs">
        <div>
          <span className="text-gray-400">Topic:</span>
          <p className="font-medium text-white truncate">{title}</p>
        </div>
        <div>
          <span className="text-gray-400">Meeting ID:</span>
          <p className="font-mono font-medium text-white">{meetingCode}</p>
        </div>
        <div>
          <span className="text-gray-400">Host:</span>
          <p className="font-medium text-white">{hostName}</p>
        </div>
        <div>
          <span className="text-gray-400">Passcode:</span>
          <p className="font-mono font-medium text-emerald-400">890214</p>
        </div>
        <div>
          <span className="text-gray-400">Invite Link:</span>
          <p className="truncate font-mono text-[11px] text-gray-300 bg-black/40 p-1.5 rounded mt-0.5">
            {inviteLink}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700/60">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-xl bg-[#0B5CFF] py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-[#004FE0] transition"
        >
          {copied ? "Link Copied!" : "Copy Invite Link"}
        </button>
      </div>
    </div>
  );
}
