"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  busy: boolean;
  error: string | null;
  initialCode?: string;
  onCancel: () => void;
  onSubmit: (codeOrLink: string, name: string) => void;
};

export default function JoinMeetingModal({
  open,
  busy,
  error,
  initialCode = "",
  onCancel,
  onSubmit,
}: Props) {
  const [codeOrLink, setCodeOrLink] = useState(initialCode);
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setCodeOrLink(initialCode);
      setName("");
    }
  }, [open, initialCode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={onCancel}>
      <form
        className="w-full max-w-[420px] rounded-xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(codeOrLink, name);
        }}
      >
        <h2 className="text-xl font-semibold text-zoom-text">Join meeting</h2>
        <p className="mt-1 text-sm text-zoom-gray">Enter a meeting ID or paste an invite link.</p>

        <label className="mt-5 block text-[13px] font-medium text-zoom-text">
          Meeting ID or link
          <input
            value={codeOrLink}
            onChange={(e) => setCodeOrLink(e.target.value)}
            placeholder="123 4567 8901"
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border px-3 text-sm outline-none transition focus:border-zoom-blue"
            autoFocus={!initialCode}
          />
        </label>
        <label className="mt-4 block text-[13px] font-medium text-zoom-text">
          Your Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border px-3 text-sm outline-none transition focus:border-zoom-blue"
            autoFocus={Boolean(initialCode)}
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 rounded-lg px-4 text-sm font-medium text-zoom-text hover:bg-zoom-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !codeOrLink.trim() || !name.trim()}
            className="h-10 rounded-lg bg-zoom-blue px-5 text-sm font-medium text-white hover:bg-zoom-blue-hover disabled:opacity-60"
          >
            {busy ? "Joining…" : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
