"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {}

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div className="space-y-4">
            <Link href="/" className="text-lg font-extrabold text-white tracking-tight">
              Kerja<span className="text-cyan-400">In</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Menghubungkan pekerja informal tangguh dengan UMKM terbaik secara cepat, transparan, dan tanpa perantara berbelit.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Untuk Pekerja</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/jobs" className="hover:text-cyan-400">Cari Lowongan</Link></li>
              <li><Link href="/applications" className="hover:text-cyan-400">Riwayat Lamaran</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Untuk UMKM</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/dashboard" className="hover:text-cyan-400">Pasang Lowongan</Link></li>
              <li><Link href="/recruiter/register" className="hover:text-cyan-400">Daftar Perekrut</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-cyan-400">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-cyan-400">Hubungi Kami</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900/60 mt-12 pt-6 flex items-center justify-between max-sm:flex-col max-sm:gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} KerjaIn. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-400">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-400">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
