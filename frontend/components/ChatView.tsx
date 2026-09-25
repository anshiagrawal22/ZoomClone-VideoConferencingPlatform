"use client";

import { useState } from "react";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export default function ChatView() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mentions" | "threads" | "more">("all");
  const [showStorageCard, setShowStorageCard] = useState(true);
  const [clearOnLogout, setClearOnLogout] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "general": [
      { id: "1", sender: "Sarah Chen", text: "Welcome everyone to Zoom Workplace Team Chat!", time: "10:15 AM", isSelf: false },
      { id: "2", sender: "Alex Rivera", text: "Great to have everything centralized in one place.", time: "10:18 AM", isSelf: false },
    ],
    "engineering": [
      { id: "3", sender: "David Kim", text: "New API endpoints deployed for real-time video sync.", time: "Yesterday", isSelf: false },
    ],
  });

  // Collapsible section state
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    apps: false,
    channels: false,
    starred: false,
    shared: true,
  });

  function toggleSection(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || !activeChannel) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInputText("");
  }

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* ── Left Chat sidebar sub-panel ───────────────────────────────────── */}
      <aside className="w-64 sm:w-72 shrink-0 border-r border-[#E5E7EB] bg-[#F8F9FA] flex flex-col">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#E5E7EB] px-4 bg-white">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <h2 className="text-[15px] font-semibold text-gray-800">Chat</h2>
            <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              title="Chat Settings"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveChannel("general")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B5CFF] text-white shadow hover:bg-[#004FE0] transition"
              title="New Chat"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter tabs row: All | @mentions | threads | ... */}
        <div className="flex items-center gap-1 border-b border-[#E5E7EB] bg-white px-3 py-2">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedFilter === "all"
                ? "bg-[#EBF3FF] text-[#0B5CFF] font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("mentions")}
            className={`rounded-full p-1.5 text-xs transition ${
              selectedFilter === "mentions" ? "bg-[#EBF3FF] text-[#0B5CFF]" : "text-gray-500 hover:bg-gray-100"
            }`}
            title="Mentions"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("threads")}
            className={`rounded-full p-1.5 text-xs transition ${
              selectedFilter === "threads" ? "bg-[#EBF3FF] text-[#0B5CFF]" : "text-gray-500 hover:bg-gray-100"
            }`}
            title="Threads"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("more")}
            className={`rounded-full p-1.5 text-xs transition ${
              selectedFilter === "more" ? "bg-[#EBF3FF] text-[#0B5CFF]" : "text-gray-500 hover:bg-gray-100"
            }`}
            title="More"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="2" />
              <circle cx="5" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        {/* Collapsible sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {/* Apps */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("apps")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200/60 uppercase tracking-wider"
            >
              <span>Apps</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${collapsed.apps ? "" : "rotate-90"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {!collapsed.apps && (
              <div className="mt-1 space-y-0.5 pl-2">
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-200/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-purple-600 font-bold text-[10px]">✨</span>
                  <span>AI Companion</span>
                </div>
              </div>
            )}
          </div>

          {/* Chats & Channels */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("channels")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200/60 uppercase tracking-wider"
            >
              <span>Chats & Channels</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${collapsed.channels ? "" : "rotate-90"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {!collapsed.channels && (
              <div className="mt-1 space-y-0.5 pl-2">
                {[
                  { id: "general", name: "# general", preview: "Alex: Great to have..." },
                  { id: "engineering", name: "# engineering", preview: "David: New API..." },
                  { id: "product", name: "# product-design", preview: "Specs ready" },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannel(ch.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                      activeChannel === ch.id
                        ? "bg-[#EBF3FF] text-[#0B5CFF] font-medium"
                        : "text-gray-700 hover:bg-gray-200/70"
                    }`}
                  >
                    <span className="truncate">{ch.name}</span>
                    {ch.id === "general" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0B5CFF]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Starred */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("starred")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200/60 uppercase tracking-wider"
            >
              <span>Starred</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${collapsed.starred ? "" : "rotate-90"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {!collapsed.starred && (
              <div className="mt-1 space-y-0.5 pl-2 text-xs text-gray-400 italic px-2">
                No starred messages
              </div>
            )}
          </div>

          {/* Shared spaces */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("shared")}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-200/60 uppercase tracking-wider"
            >
              <span>Shared spaces</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${collapsed.shared ? "" : "rotate-90"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────────── */}
      <main className="relative flex flex-1 flex-col bg-[#F7F9FA] overflow-hidden">
        {/* Dismissible Local Data Storage info card, top-right */}
        {showStorageCard && (
          <div className="absolute top-4 right-4 z-20 max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0B5CFF]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Local Data Storage</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStorageCard(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Dismiss"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-600">
              Store your message history locally on this device for faster search and offline access.
            </p>

            <label className="mt-3 flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={clearOnLogout}
                onChange={(e) => setClearOnLogout(e.target.checked)}
                className="rounded border-gray-300 text-[#0B5CFF] focus:ring-[#0B5CFF]"
              />
              <span>Clear data on logout</span>
            </label>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowStorageCard(false)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Disable
              </button>
              <button
                type="button"
                onClick={() => setShowStorageCard(false)}
                className="rounded-lg bg-[#0B5CFF] px-3.5 py-1 text-xs font-medium text-white hover:bg-[#004FE0] transition shadow-sm"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Content area: Either Empty State or Active Conversation */}
        {activeChannel ? (
          <div className="flex h-full flex-col">
            {/* Active channel header */}
            <div className="flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white px-5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">#{activeChannel}</span>
                <span className="text-xs text-gray-400">Company announcement and updates</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveChannel(null)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Close channel
              </button>
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {(messages[activeChannel] || []).map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{msg.sender}</span>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      msg.isSelf
                        ? "bg-[#0B5CFF] text-white rounded-br-xs"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="border-t border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-xs focus-within:border-[#0B5CFF] focus-within:ring-2 focus-within:ring-[#0B5CFF]/15">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message #${activeChannel}`}
                  className="flex-1 text-sm text-gray-800 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B5CFF] text-white disabled:opacity-40 transition hover:bg-[#004FE0]"
                >
                  <svg className="h-4 w-4 rotate-45 -mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Empty state matching the reference screenshot */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            {/* Two-tone speech-bubble illustration with three dots */}
            <div className="relative mb-6">
              <svg className="h-32 w-32 drop-shadow-sm" viewBox="0 0 120 120" fill="none">
                {/* Secondary speech bubble in background */}
                <path
                  d="M75 35H35C27 35 20 42 20 50V68C20 76 27 83 35 83H40V95L54 83H75C83 83 90 76 90 68V50C90 42 83 35 75 35Z"
                  fill="#E0E7FF"
                />
                {/* Primary speech bubble */}
                <path
                  d="M95 48H55C47 48 40 55 40 63V81C40 89 47 96 55 96H75L88 106V96H95C103 96 110 89 110 81V63C110 55 103 48 95 48Z"
                  fill="#0B5CFF"
                />
                {/* Three dots inside the main speech bubble */}
                <circle cx="65" cy="72" r="3.5" fill="white" />
                <circle cx="75" cy="72" r="3.5" fill="white" />
                <circle cx="85" cy="72" r="3.5" fill="white" />
              </svg>
            </div>

            <p className="max-w-xs text-sm font-medium text-gray-600">
              Start chatting by clicking or creating a chat in the left sidebar.
            </p>

            <button
              type="button"
              onClick={() => setActiveChannel("general")}
              className="mt-4 rounded-lg bg-[#0B5CFF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#004FE0] transition"
            >
              Open #general chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
