"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** SVG icon components used in the sidebar */
const icons = {
  briefcase: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="6"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 10h16"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  clipboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="4"
        y="3"
        width="12"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 3V2a1 1 0 011-1h4a1 1 0 011 1v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 9h6M7 12h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 18c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.99 3.99l1.41 1.41M14.6 14.6l1.41 1.41M3.99 16.01l1.41-1.41M14.6 5.4l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 8.5L10 2l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 18v-5a1 1 0 011-1h4a1 1 0 011 1v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof icons;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Cari Kerja", href: "/jobs", icon: "briefcase" },
  { label: "Lamaran Saya", href: "/applications", icon: "clipboard" },
  { label: "Profil", href: "/profile", icon: "user" },
  { label: "Pengaturan", href: "/settings", icon: "settings" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col",
        "bg-deep-700 text-slate-300",
        "border-r border-deep-600",
        "max-md:hidden" // Hidden on mobile viewports below 768px
      )}
    >
      {/* ── Logo ── */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-deep-600">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            "bg-cyan-500/15 text-cyan-400"
          )}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 8.5L10 2l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"
              fill="currentColor"
              opacity="0.3"
            />
            <path
              d="M3 8.5L10 2l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Kerja<span className="text-cyan-400">In</span>
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-sm font-medium transition-all duration-200",
                isActive
                  ? [
                      "bg-cyan-500/10 text-cyan-400",
                      "shadow-[inset_3px_0_0_0] shadow-cyan-400",
                    ].join(" ")
                  : "text-slate-400 hover:bg-deep-600 hover:text-slate-200"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-cyan-400" : "text-slate-500"
                )}
              >
                {icons[item.icon]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="border-t border-deep-600 px-3 py-3">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
            "text-sm font-medium text-slate-500",
            "hover:bg-deep-600 hover:text-error-500",
            "transition-colors duration-200 cursor-pointer"
          )}
        >
          {icons.logout}
          Keluar
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
