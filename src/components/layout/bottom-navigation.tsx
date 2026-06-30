"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const icons = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  briefcase: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H9a2 2 0 0 0-2 2v2h10V4a2 2 0 0 0-2-2z"/>
      <rect width="20" height="14" x="2" y="6" rx="2"/>
      <path d="M12 11h.01"/>
      <path d="M3 16h18"/>
    </svg>
  ),
  clipboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
  ),
  user: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

interface MobileNavItem {
  label: string;
  href: string;
  icon: keyof typeof icons;
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: "home" },
  { label: "Cari Kerja", href: "/jobs", icon: "briefcase" },
  { label: "Lamaran", href: "/applications", icon: "clipboard" },
  { label: "Profil", href: "/profile", icon: "user" },
];

function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "h-[68px] border-t border-border bg-card/95 backdrop-blur-md",
        "flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      )}
    >
      {mobileNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "w-16 h-12 rounded-xl transition-all duration-200 select-none",
              isActive
                ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <div className={cn("transition-transform duration-200", isActive && "scale-110")}>
              {icons[item.icon]}
            </div>
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { BottomNavigation };
