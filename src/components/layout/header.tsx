"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  /** User display name */
  userName?: string;
  /** User role label */
  userRole?: string;
  /** User avatar URL */
  avatarUrl?: string | null;
}

function Header({
  userName = "Pengguna",
  userRole = "Pelamar",
  avatarUrl,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "border-b border-border bg-card/80 backdrop-blur-md",
        "px-8 max-md:px-4"
      )}
    >
      {/* ── Left: Page context (mobile hamburger placeholder) ── */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button — only visible below md */}
        <button
          className={cn(
            "hidden max-md:flex",
            "h-9 w-9 items-center justify-center rounded-lg",
            "text-slate-500 hover:bg-slate-100",
            "transition-colors duration-150 cursor-pointer"
          )}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div>
          <h2 className="text-sm font-semibold text-deep-700 dark:text-slate-100">
            Selamat datang kembali 👋
          </h2>
          <p className="text-xs text-muted-foreground">
            Temukan pekerjaan yang cocok untuk Anda
          </p>
        </div>
      </div>

      {/* ── Right: Notifications + Profile ── */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg",
            "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
            "dark:hover:bg-slate-800 dark:hover:text-slate-300",
            "transition-colors duration-150 cursor-pointer"
          )}
          aria-label="Notifikasi"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M13.5 6.75a4.5 4.5 0 10-9 0c0 4.5-2.25 5.625-2.25 5.625h13.5s-2.25-1.125-2.25-5.625z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.297 15.188a1.5 1.5 0 01-2.594 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-urgent-500" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
              "transition-colors duration-150 cursor-pointer"
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "bg-deep-700 text-xs font-bold text-cyan-400"
                )}
              >
                {initials}
              </div>
            )}
            <div className="text-left max-md:hidden">
              <p className="text-sm font-semibold text-deep-700 dark:text-slate-100 leading-tight">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <svg
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200 max-md:hidden",
                isDropdownOpen && "rotate-180"
              )}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className={cn(
                "absolute right-0 top-full mt-2 w-56",
                "rounded-xl border border-border bg-card p-1.5",
                "shadow-elevated animate-slide-down"
              )}
            >
              <div className="border-b border-border px-3 py-2.5 mb-1.5">
                <p className="text-sm font-semibold text-deep-700 dark:text-slate-100">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>

              {[
                { label: "Profil Saya", href: "/profile" },
                { label: "Pengaturan", href: "/settings" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2",
                    "text-sm text-slate-600 dark:text-slate-400",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    "transition-colors duration-150"
                  )}
                >
                  {item.label}
                </a>
              ))}

              <div className="border-t border-border mt-1.5 pt-1.5">
                <button
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2",
                    "text-sm text-error-500",
                    "hover:bg-error-50 dark:hover:bg-error-500/10",
                    "transition-colors duration-150 cursor-pointer"
                  )}
                >
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header };
export type { HeaderProps };
