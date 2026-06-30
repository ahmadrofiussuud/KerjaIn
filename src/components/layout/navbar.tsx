"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
  onSearchChange?: (val: string) => void;
}

export function Navbar({ onSearchChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<"applicant" | "recruiter" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Safe check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

  // Private routes where users must be logged in
  const isPrivateRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/settings") || 
    pathname.startsWith("/applications");

  useEffect(() => {
    // 1. Handling Supabase Not Configured (Offline Demo Mode)
    if (!isSupabaseConfigured) {
      const getMockSession = () => {
        let storedRole = localStorage.getItem("mock_user_role") as "applicant" | "recruiter" | null;
        
        // If we are on a private dashboard page and no role is set, initialize as applicant
        if (isPrivateRoute && !storedRole) {
          storedRole = "applicant";
          localStorage.setItem("mock_user_role", "applicant");
        }

        if (storedRole) {
          setCurrentRole(storedRole);
          setUser({
            id: "mock-user",
            email: storedRole === "applicant" ? "budi.santoso@example.com" : "hendra.kopi@example.com",
            user_metadata: {
              full_name: storedRole === "applicant" ? "Budi Santoso" : "Hendra (Kopi Kenangan)",
              role: storedRole,
            },
          } as any);
        } else {
          setUser(null);
          setCurrentRole(null);
        }
        setLoading(false);
      };

      getMockSession();

      // Listen for local changes to the role switcher (from dashboard page)
      const handleRoleChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        const newRole = customEvent.detail as "applicant" | "recruiter";
        localStorage.setItem("mock_user_role", newRole);
        setCurrentRole(newRole);
        setUser({
          id: "mock-user",
          email: newRole === "applicant" ? "budi.santoso@example.com" : "hendra.kopi@example.com",
          user_metadata: {
            full_name: newRole === "applicant" ? "Budi Santoso" : "Hendra (Kopi Kenangan)",
            role: newRole,
          },
        } as any);
      };

      window.addEventListener("mock-role-change", handleRoleChange);
      return () => {
        window.removeEventListener("mock-role-change", handleRoleChange);
      };
    }

    // 2. Handling Online Supabase Session
    const supabase = createClient();

    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          setCurrentRole(user.user_metadata?.role || "applicant");
        } else {
          setCurrentRole(null);
        }
      } catch (err) {
        console.error("Error getting user session", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setCurrentRole(u.user_metadata?.role || "applicant");
      } else {
        setCurrentRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured, isPrivateRoute]);

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

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("mock_user_role");
    }
    setUser(null);
    setCurrentRole(null);
    setIsDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const getInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "User";
    return name
      .split(" ")
      .map((w: string) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Pengguna";
  const userRoleText = currentRole === "recruiter" ? "Perekrut (UMKM)" : "Pelamar (Pencari Kerja)";

  // Dynamic Navigation Links based on role
  // Differentiate applicant vs recruiter navigation!
  const getNavigationLinks = () => {
    if (!user) {
      return [
        { label: "Cari Kerja", href: "/jobs" },
      ];
    }

    if (currentRole === "recruiter") {
      return [
        { label: "Dashboard Perekrut", href: "/dashboard" },
        { label: "Cari Kerja", href: "/jobs" },
      ];
    }

    // Default: Applicant Links
    return [
      { label: "Cari Kerja", href: "/jobs" },
      { label: "Lamaran Saya", href: "/applications" },
      { label: "Dashboard Saya", href: "/dashboard" },
    ];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Side: Logo & Main Menu */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2 2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                  <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                  <path d="M8 10h4" />
                </svg>
              </div>
              <Link href="/" className="text-xl font-extrabold text-slate-900 tracking-tight">
                Kerja<span className="text-sky-600">In</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            {!loading && (
              <div className="hidden md:flex items-center gap-6">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm font-semibold transition-colors duration-150 py-1.5",
                        isActive
                          ? "text-sky-600 border-b-2 border-sky-600"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Auth CTA or Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              /* Authenticated User Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-xs font-bold text-sky-600">
                    {getInitials()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {userName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {userRoleText}
                    </p>
                  </div>
                  <svg
                    className={cn(
                      "h-4 w-4 text-slate-400 transition-transform duration-200",
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

                {/* Dropdown container */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated animate-slide-down">
                    <div className="border-b border-slate-100 px-3 py-2.5 mb-1.5">
                      <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-xs text-slate-400">{userRoleText}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Profil Saya
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Pengaturan
                    </Link>

                    <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Navigation */
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-sky-600 text-white hover:bg-sky-500 px-4.5 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {!loading && isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-600 hover:text-sky-600"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-1 py-1.5">
                  <p className="text-sm font-bold text-slate-950">{userName}</p>
                  <p className="text-xs text-slate-400">{userRoleText}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1"
                >
                  Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-red-600 hover:text-red-700 py-1 cursor-pointer"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-slate-600 hover:text-slate-900 py-2"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center text-sm font-semibold bg-sky-600 text-white py-2.5 rounded-lg"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
