"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * PublicNavbar — hanya untuk halaman publik / landing page sebelum login.
 * Menggunakan `fixed` agar tidak pernah hilang di balik overflow-hidden sections.
 * Menu: Beranda | Tentang Kami | Cara Kerja | Cari Kerja
 * CTA kanan: Masuk | Daftar Sekarang
 */
export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section highlight via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["beranda", "tentang", "cara-kerja", "lowongan"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#beranda", id: "beranda" },
    { label: "Tentang Kami", href: "#tentang", id: "tentang" },
    { label: "Cara Kerja", href: "#cara-kerja", id: "cara-kerja" },
    { label: "Cari Kerja", href: "#lowongan", id: "lowongan" },
  ];

  return (
    <>
      {/* ── FIXED NAVBAR ── */}
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm"
            : "border-b border-slate-100/60 bg-white/90 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Kerja<span className="text-sky-600">In</span>
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
                      "relative text-sm font-semibold px-4 py-2 rounded-lg transition-all",
                      isActive
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-sky-500" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-sky-600 px-4 py-2 rounded-lg hover:bg-sky-50 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl shadow-sm shadow-sky-200 hover:shadow-md hover:shadow-sky-200 hover:-translate-y-0.5 transition-all"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu — slides in below navbar */}
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
                className="block text-center text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl transition-colors"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── SPACER — kompensasi tinggi navbar fixed 64px ── */}
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}

