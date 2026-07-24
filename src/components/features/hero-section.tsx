"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ScrollFramePlayer,
  type ScrollFramePlayerHandle,
} from "@/components/features/scroll-frame-player";

export function HeroSection() {
  const playerRef   = useRef<ScrollFramePlayerHandle>(null);
  const progressRef = useRef(0);
  const lockedRef   = useRef(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 1. Selalu mulai dari scroll = 0
    window.scrollTo(0, 0);

    // 2. Lock scroll body sepenuhnya — ini yang paling penting
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const STEP = 0.030;

    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      document.body.style.overflow = prevOverflow || "";
      setDone(true);
    };

    const advance = (delta: number) => {
      if (!lockedRef.current) return;
      if (progressRef.current <= 0 && delta < 0) return;

      progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta));
      playerRef.current?.setProgress(progressRef.current);

      if (progressRef.current >= 1) unlock();
    };

    // Wheel
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      advance(e.deltaY > 0 ? STEP : -STEP);
    };

    // Touch
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      advance((touchY - e.touches[0].clientY) * 0.008);
      touchY = e.touches[0].clientY;
    };

    // Keyboard (arrow down / PageDown juga bisa drive parallax)
    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        advance(STEP * 2);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        advance(-STEP * 2);
      }
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("keydown",    onKeyDown);

    return () => {
      // Pastikan scroll dilepas saat komponen unmount
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("keydown",    onKeyDown);
    };
  }, []);

  return (
    <section
      id="beranda"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Parallax Canvas */}
      <div className="absolute inset-0 z-0">
        <ScrollFramePlayer ref={playerRef} frameCount={100} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">



        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Cari Kerja Harian &{" "}
          <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
            Sampingan
          </span>{" "}
          Lebih Mudah
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mt-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          KerjaIn menghubungkan pekerja informal dengan UMKM lokal secara instan.
          Tanpa CV, tanpa perantara, tanpa biaya pendaftaran.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="#tentang"
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-2xl shadow-lg shadow-sky-900/40 hover:-translate-y-0.5 transition-all text-sm tracking-wider uppercase"
          >
            Lihat Lowongan →
          </a>
          <Link
            href="/register"
            className="px-8 py-4 bg-white/10 border border-white/25 hover:bg-white/20 text-white font-extrabold rounded-2xl transition-all text-sm tracking-wider uppercase backdrop-blur-sm"
          >
            Daftar Gratis Sekarang
          </Link>
        </div>



        {/* Scroll hint */}
        <div className={`mt-10 flex flex-col items-center gap-2 transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <span className="text-[10px] text-slate-400 tracking-[0.25em] uppercase">Scroll untuk melanjutkan</span>
          <div className="w-5 h-8 border-2 border-slate-500 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
