"use client";

type Props = {
  open: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function NewMeetingModal({ open, busy, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-[420px] rounded-xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="new-meeting-title"
      >
        <h2 id="new-meeting-title" className="text-xl font-semibold text-zoom-text">
          Start an instant meeting?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zoom-gray">
          You&apos;ll join as the host. Share the meeting ID from the call once you&apos;re in.
        </p>
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
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="h-10 rounded-lg bg-zoom-blue px-5 text-sm font-medium text-white hover:bg-zoom-blue-hover disabled:opacity-60"
          >
            {busy ? "Starting…" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
