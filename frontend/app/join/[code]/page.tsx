"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JoinMeetingModal from "@/components/JoinMeetingModal";
import { compactMeetingCode, getMeeting, joinMeeting } from "@/lib/api";

export default function JoinByCodePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const code = compactMeetingCode(params.code);

  async function submitJoin(_codeOrLink: string, name: string) {
    setBusy(true);
    setError(null);
    try {
      const meeting = await getMeeting(code);
      if (!meeting) {
        setError("Invalid meeting ID. Please check and try again.");
        setBusy(false);
        return;
      }
      await joinMeeting(code, name.trim());
      router.push(`/meeting/${code}?name=${encodeURIComponent(name.trim())}`);
    } catch {
      setError("Invalid meeting ID. Please check and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zoom-muted">
      <header className="h-14 border-b border-zoom-border bg-white px-6">
        <div className="flex h-full items-center">
          <span className="text-[22px] font-semibold tracking-tight text-zoom-blue">zoom</span>
        </div>
      </header>
      <JoinMeetingModal
        open
        busy={busy}
        error={error}
        initialCode={code}
        onCancel={() => router.push("/")}
        onSubmit={submitJoin}
      />
    </div>
  );
}
