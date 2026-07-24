"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

/**
 * PublicNavbar
 * - Transparan (menyatu dengan hero) saat hero section masih terlihat
 * - Berubah solid putih setelah hero ter-scroll keluar viewport
 */
export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);   // true = navbar transparan
  const [activeSection, setActiveSection] = useState("beranda");

  // Transparan saat scrollY = 0 (hero), putih begitu user scroll sedikit saja
  useEffect(() => {
    const onScroll = () => setOverHero(window.scrollY < 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section highlight
  useEffect(() => {
    const sectionIds = ["beranda", "tentang", "cara-kerja", "lowongan"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navLinks = [
    { label: "Beranda",     href: "#beranda",    id: "beranda"    },
    { label: "Tentang Kami",href: "#tentang",    id: "tentang"    },
    { label: "Cara Kerja",  href: "#cara-kerja", id: "cara-kerja" },
    { label: "Cari Kerja",  href: "#lowongan",   id: "lowongan"   },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          overHero
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/70"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <span
                className={cn(
                  "text-xl font-extrabold tracking-tight transition-colors duration-500",
                  overHero
                    ? "text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]"
                    : "text-slate-900"
                )}
              >
                Kerja<span className="text-sky-500">In</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                      overHero
                        ? isActive
                          ? "text-white font-bold [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
                          : "text-slate-200 hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
                        : isActive
                          ? "text-sky-600 bg-sky-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {link.label}
                    {isActive && !overHero && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-sky-500" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className={cn(
                  "text-sm font-bold transition-all px-4 py-2 rounded-lg duration-200",
                  overHero
                    ? "text-white/90 hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-md shadow-sky-900/30 hover:-translate-y-0.5 transition-all text-xs tracking-wide uppercase"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className={cn(
                "md:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                overHero ? "text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <Icon name={isMobileMenuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-slate-700 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-xl transition-colors"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
