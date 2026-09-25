"use client";

import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "available" | "busy" | "away" | "offline";
  avatarBg: string;
}

export default function ContactsView() {
  const [search, setSearch] = useState("");
  const contacts: Contact[] = [
    { id: "1", name: "Sarah Chen", email: "sarah.chen@workplace.com", role: "Product Design Lead", status: "available", avatarBg: "from-blue-500 to-indigo-600" },
    { id: "2", name: "Alex Rivera", email: "alex.rivera@workplace.com", role: "Senior Frontend Engineer", status: "available", avatarBg: "from-emerald-500 to-teal-600" },
    { id: "3", name: "David Kim", email: "david.kim@workplace.com", role: "Backend Architect", status: "busy", avatarBg: "from-amber-500 to-orange-600" },
    { id: "4", name: "Emily Watson", email: "emily.w@workplace.com", role: "Technical Program Manager", status: "away", avatarBg: "from-purple-500 to-pink-600" },
    { id: "5", name: "James Wilson", email: "jwilson@workplace.com", role: "DevOps Engineer", status: "offline", avatarBg: "from-gray-500 to-slate-600" },
  ];

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-[#F8F9FA] overflow-y-auto p-6 sm:p-8">
      <div className="mx-auto max-w-4xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Company Directory</h1>
            <p className="text-xs text-gray-500 mt-1">Connect with your colleagues, teammates, and channels</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 pl-8 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-[#0B5CFF]"
              />
              <svg className="h-3.5 w-3.5 absolute left-2.5 top-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <button
              type="button"
              className="rounded-lg bg-[#0B5CFF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#004FE0]"
            >
              Add Contact
            </button>
          </div>
        </div>

        {/* Contacts list */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs hover:border-gray-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr ${contact.avatarBg} text-xs font-bold text-white shadow-sm`}>
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                      contact.status === "available"
                        ? "bg-emerald-500"
                        : contact.status === "busy"
                        ? "bg-red-500"
                        : contact.status === "away"
                        ? "bg-amber-400"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">{contact.name}</h3>
                  <p className="text-xs text-gray-500">{contact.role}</p>
                  <p className="text-[11px] text-gray-400">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                  title="Send message"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-[#0B5CFF] hover:bg-blue-50 transition"
                  title="Start video call"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
