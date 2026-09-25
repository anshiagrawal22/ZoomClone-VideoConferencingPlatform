"use client";

import { useState } from "react";
import Link from "next/link";

interface AppHeaderProps {
  userName?: string;
  userInitial?: string;
}

export default function AppHeader({
  userName = "Anshi Agrawal",
  userInitial = "A",
}: AppHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-13 w-full shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
      {/* ── Left section: Brand & Product links ────────────────────────────── */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[24px] font-bold tracking-tight text-[#0B5CFF] hover:opacity-90 transition">
            zoom
          </Link>
          <span className="text-gray-300 font-light text-base select-none">|</span>
          <span className="text-[15px] font-normal tracking-normal text-[#111827]">
            Workplace
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-5 text-[13px] text-[#4B5563]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProductsMenu(!showProductsMenu)}
              className="flex items-center gap-1 hover:text-[#111827] transition"
            >
              <span>Discover Products</span>
              <svg className="h-3 w-3 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showProductsMenu && (
              <div
                className="absolute left-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50"
                onMouseLeave={() => setShowProductsMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Zoom Workspace Suite
                </div>
                {["Meetings & Spaces", "Team Chat", "Zoom Phone", "Scheduler", "Whiteboard", "AI Companion"].map((item) => (
                  <div
                    key={item}
                    className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-xs text-gray-700 hover:bg-[#F3F4F6] transition"
                    onClick={() => setShowProductsMenu(false)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="#pricing" className="hover:text-[#111827] transition">
            Pricing
          </a>
        </div>
      </div>

      {/* ── Center: Chevrons, clock/search & pill input ──────────────────── */}
      <div className="flex flex-1 max-w-lg items-center gap-2 mx-4 sm:mx-8">
        <div className="hidden sm:flex items-center gap-1 text-[#6B7280]">
          <button
            type="button"
            className="p-1 hover:text-[#111827] rounded transition"
            title="Back"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="p-1 hover:text-[#111827] rounded transition"
            title="Forward"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="p-1 hover:text-[#111827] rounded transition ml-0.5"
            title="History"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Pill Search container */}
        <div
          className={`flex flex-1 items-center rounded-lg bg-[#F0F2F5] px-3 py-1.5 transition-all ${
            searchFocused
              ? "bg-white ring-2 ring-[#0B5CFF]/30 border border-[#0B5CFF]"
              : "border border-transparent hover:bg-[#EAECEF]"
          }`}
        >
          <svg className="h-3.5 w-3.5 text-[#6B7280] shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Ctrl+K"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent text-xs text-gray-800 placeholder-[#6B7280] outline-none"
          />
        </div>
      </div>

      {/* ── Right section: Admin Center, Download, Upgrade, Bell, Avatar ─── */}
      <div className="flex items-center gap-3">
        <a
          href="#admin"
          className="hidden md:inline-block text-[13px] text-[#4B5563] hover:text-[#111827] transition"
        >
          Admin Center
        </a>

        {/* Download light-blue pill */}
        <button
          type="button"
          className="hidden sm:inline-flex items-center rounded-full bg-[#EBF3FF] px-3 py-1 text-xs font-semibold text-[#0B5CFF] hover:bg-[#DCEBFF] transition"
        >
          Download
        </button>

        {/* Upgrade solid-blue pill */}
        <button
          type="button"
          className="inline-flex items-center rounded-full bg-[#0B5CFF] px-3.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-[#004FE0] active:scale-95 transition"
        >
          Upgrade
        </button>

        {/* Bell with red indicator dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
            title="Notifications"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-700">Notifications</span>
                <span className="text-[11px] text-[#0B5CFF] cursor-pointer">Mark all read</span>
              </div>
              <div className="py-4 text-center text-xs text-gray-400">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User avatar: dark teal with white A and small orange camera badge */}
        <div className="relative cursor-pointer group" title={userName}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#004D40] text-xs font-bold text-white shadow-xs">
            {userInitial}
          </div>
          {/* Small orange video camera badge on the edge */}
          <span className="absolute -top-0.5 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF7A00] ring-1 ring-white">
            <svg className="h-2 w-2 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 3.5v-10l-4 3.5z" />
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
}
