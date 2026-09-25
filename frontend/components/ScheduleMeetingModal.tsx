"use client";

import { useState } from "react";
import { createScheduledMeeting } from "@/lib/api";

type Props = {
  open: boolean;
  onCancel: () => void;
  /** Called after a successful POST so the dashboard can reload the list. */
  onScheduled: () => void;
};

export default function ScheduleMeetingModal({ open, onCancel, onScheduled }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [duration, setDuration] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setTitle("");
    setDescription("");
    setDatetime("");
    setDuration(30);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !datetime) return;
    setBusy(true);
    setError(null);
    try {
      await createScheduledMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduled_at: new Date(datetime).toISOString(),
        duration_minutes: duration,
      });
      reset();
      onScheduled();
    } catch {
      setError("Failed to schedule meeting. Please try again.");
      setBusy(false);
    }
  }

  // Minimum datetime: 1 min from now
  const minDatetime = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={() => { reset(); onCancel(); }}
    >
      <form
        className="w-full max-w-[480px] rounded-xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        role="dialog"
        aria-labelledby="schedule-title"
      >
        <h2 id="schedule-title" className="text-xl font-semibold text-zoom-text">
          Schedule a Meeting
        </h2>
        <p className="mt-1 text-sm text-zoom-gray">
          It will appear in your Upcoming list with a shareable invite link.
        </p>

        <label className="mt-5 block text-[13px] font-medium text-zoom-text">
          Topic *
          <input
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly standup, Design review…"
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border px-3 text-sm outline-none transition focus:border-zoom-blue"
          />
        </label>

        <label className="mt-4 block text-[13px] font-medium text-zoom-text">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional agenda or notes"
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border px-3 text-sm outline-none transition focus:border-zoom-blue"
          />
        </label>

        <label className="mt-4 block text-[13px] font-medium text-zoom-text">
          Date &amp; Time *
          <input
            required
            type="datetime-local"
            value={datetime}
            min={minDatetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border px-3 text-sm outline-none transition focus:border-zoom-blue"
          />
        </label>

        <label className="mt-4 block text-[13px] font-medium text-zoom-text">
          Duration
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1.5 h-11 w-full rounded-lg border border-zoom-border bg-white px-3 text-sm outline-none transition focus:border-zoom-blue"
          >
            {[15, 30, 45, 60, 90, 120].map((m) => (
              <option key={m} value={m}>
                {m < 60 ? `${m} min` : `${m / 60} hr${m / 60 > 1 ? "s" : ""}`}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { reset(); onCancel(); }}
            disabled={busy}
            className="h-10 rounded-lg px-4 text-sm font-medium text-zoom-text hover:bg-zoom-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !title.trim() || !datetime}
            className="h-10 rounded-lg bg-zoom-blue px-5 text-sm font-medium text-white hover:bg-zoom-blue-hover disabled:opacity-60"
          >
            {busy ? "Scheduling…" : "Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
