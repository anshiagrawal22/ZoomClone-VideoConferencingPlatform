"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppSidebar, { type NavTab } from "@/components/AppSidebar";
import MeetingRoom from "@/components/MeetingRoom";
import ChatView from "@/components/ChatView";
import ContactsView from "@/components/ContactsView";
import MeetingsView from "@/components/MeetingsView";

function MeetingRoomLoader({ code }: { code: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name")?.trim() || "Anshi Agrawal";
  const autoShare = searchParams.get("share") === "1";
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      {/* ── Top full-width navbar ── */}
      <AppHeader userName={name} userInitial="A" />

      {/* ── Center: Left sidebar + Main scoped content ── */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSettings={() => alert("Zoom Workplace settings")}
        />

        <div className="relative flex flex-1 overflow-hidden bg-white">
          {activeTab === "home" && (
            <MeetingRoom
              code={code}
              selfName={name}
              userInitial="A"
              autoShare={autoShare}
              onEndMeeting={() => router.push("/")}
            />
          )}

          {activeTab === "chat" && <ChatView />}

          {activeTab === "meetings" && (
            <MeetingsView
              onStartMeeting={() => setActiveTab("home")}
              onOpenSchedule={() => router.push("/")}
            />
          )}

          {activeTab === "contacts" && <ContactsView />}
        </div>
      </div>
    </div>
  );
}

export default function MeetingPage({ params }: { params: { code: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121214]" />}>
      <MeetingRoomLoader code={params.code} />
    </Suspense>
  );
}
