"use client";

export type NavTab = "home" | "chat" | "meetings" | "contacts";

interface AppSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSettings?: () => void;
}

export default function AppSidebar({ activeTab, onTabChange, onOpenSettings }: AppSidebarProps) {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "chat",
      label: "Chat",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4m-7 6l2.5-2.5H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h.5L5 20z" />
        </svg>
      ),
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="6" width="13" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l5-3v10l-5-3v-4z" />
        </svg>
      ),
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="10" r="2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 17c0-2 2-3 4-3s4 1 4 3" />
          <line x1="15" y1="9" x2="18" y2="9" strokeLinecap="round" />
          <line x1="15" y1="13" x2="18" y2="13" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className="hidden sm:flex w-[68px] shrink-0 flex-col items-center justify-between border-r border-[#E5E7EB] bg-white py-3 select-none"
      aria-label="Sidebar Navigation"
    >
      {/* Top navigation items */}
      <div className="flex w-full flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`group flex w-[56px] flex-col items-center justify-center rounded-xl py-2 transition-all ${
                isActive
                  ? "border border-gray-200 bg-white shadow-xs text-gray-800"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <div className="transition-transform group-hover:scale-105">{item.icon}</div>
              <span
                className={`mt-1 text-[10px] font-medium leading-none ${
                  isActive ? "text-[#111827] font-semibold" : "text-[#4B5563]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Settings icon pinned to bottom of sidebar */}
      <div className="flex w-full flex-col items-center">
        <button
          type="button"
          onClick={onOpenSettings}
          className="group flex w-[56px] flex-col items-center justify-center rounded-xl py-2 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition"
          title="Settings"
        >
          <svg className="h-5 w-5 transition-transform group-hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
            />
          </svg>
          <span className="mt-1 text-[10px] font-medium leading-none text-[#4B5563]">Settings</span>
        </button>
      </div>
    </aside>
  );
}
