"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * AppNavbar — clean, role-aware navbar untuk halaman setelah login.
 * Fixed di atas layar. Menu berbeda antara Pelamar dan Perekrut.
 */
export function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"applicant" | "recruiter">("applicant");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

  // ─── Auth / Mock ───────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const storedRole = (localStorage.getItem("mock_user_role") as "applicant" | "recruiter") || "applicant";
      setRole(storedRole);
      setUser({
        id: "mock",
        email: storedRole === "recruiter" ? "hendra@kopiken.com" : "budi@example.com",
        user_metadata: {
          full_name: storedRole === "recruiter" ? "Hendra Wijaya" : "Budi Santoso",
          role: storedRole,
        },
      } as any);
      setLoading(false);

      const handleChange = (e: Event) => {
        const ev = e as CustomEvent;
        const r = ev.detail as "applicant" | "recruiter";
        setRole(r);
        setUser((prev: any) => ({
          ...prev,
          email: r === "recruiter" ? "hendra@kopiken.com" : "budi@example.com",
          user_metadata: {
            full_name: r === "recruiter" ? "Hendra Wijaya" : "Budi Santoso",
            role: r,
          },
        }));
      };
      window.addEventListener("mock-role-change", handleChange);
      return () => window.removeEventListener("mock-role-change", handleChange);
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setRole((user?.user_metadata?.role as any) || "applicant");
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setRole((s?.user?.user_metadata?.role as any) || "applicant");
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  // ─── Close dropdown on outside click ──────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    } else {
      localStorage.removeItem("mock_user_role");
    }
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  // ─── Computed ──────────────────────────────────────────────────
  const isRecruiter = role === "recruiter";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Pengguna";
  const initials = userName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const navLinks = isRecruiter
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pasang Lowongan", href: "/post-job" },
        { label: "Kelola Lamaran", href: "/manage-jobs" },
      ]
    : [
        { label: "Cari Kerja", href: "/jobs" },
        { label: "Lamaran Saya", href: "/applications" },
        { label: "Dashboard", href: "/dashboard" },
      ];

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── LEFT: Logo + Role badge ── */}
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href={isRecruiter ? "/dashboard" : "/jobs"}
                className="flex items-center gap-2 shrink-0"
              >
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm shrink-0",
                  isRecruiter ? "bg-cyan-600" : "bg-sky-600"
                )}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight hidden sm:block">
                  Kerja<span className={isRecruiter ? "text-cyan-600" : "text-sky-600"}>In</span>
                </span>
              </Link>

              {!loading && (
                <span className={cn(
                  "hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border shrink-0",
                  isRecruiter
                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", isRecruiter ? "bg-cyan-500" : "bg-sky-500")} />
                  {isRecruiter ? "Mode Perekrut" : "Mode Pelamar"}
                </span>
              )}
            </div>

            {/* ── CENTER: Nav Links (desktop) ── */}
            {!loading && (
              <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm font-semibold px-3 py-2 rounded-lg transition-all whitespace-nowrap",
                        isActive
                          ? isRecruiter ? "text-cyan-700 bg-cyan-50" : "text-sky-700 bg-sky-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── RIGHT: Profile dropdown ── */}
            <div className="flex items-center gap-2 shrink-0">
              {loading ? (
                <div className="h-9 w-28 bg-slate-100 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 h-10 pl-2 pr-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0",
                      isRecruiter ? "bg-cyan-600" : "bg-sky-600"
                    )}>
                      {initials}
                    </div>
                    {/* Name — hidden on small screens */}
                    <div className="hidden sm:block text-left min-w-0 max-w-[120px]">
                      <p className="text-sm font-bold text-slate-900 truncate leading-tight">{userName}</p>
                      <p className="text-[10px] text-slate-400 leading-tight truncate">
                        {isRecruiter ? "Perekrut (UMKM)" : "Pencari Kerja"}
                      </p>
                    </div>
                    <svg
                      className={cn("h-4 w-4 text-slate-400 transition-transform shrink-0", isDropdownOpen && "rotate-180")}
                      viewBox="0 0 16 16" fill="none"
                    >
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 animate-slide-down">
                      {/* User header */}
                      <div className="px-3 py-2.5 mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-1 mb-1">
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profil Saya
                        </Link>
                        <Link href="/settings" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Pengaturan
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
                  Masuk
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        )}>
          <div className="border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {!loading && navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors",
                  pathname === link.href ? "text-sky-600 bg-sky-50" : "text-slate-600 hover:bg-slate-50"
                )}>
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-3 border-t border-slate-100">
                <button onClick={handleLogout}
                  className="w-full text-left text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-colors">
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer untuk kompensasi fixed navbar */}
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}
