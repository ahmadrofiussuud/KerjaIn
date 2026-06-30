"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────
type AppStatus = "accepted" | "reviewing" | "pending" | "rejected";

interface Application {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  type: string;
  salary: string;
  status: AppStatus;
  appliedAt: string;
  cover: string;
  isUrgent?: boolean;
  note: string;
}

// ─── Mock Data ────────────────────────────────────────────────────
const mockApplications: Application[] = [
  {
    id: "a1",
    title: "Barista Kafe Premium",
    company: "Kopi Kenangan",
    companyInitials: "KK",
    companyColor: "bg-amber-600",
    location: "Jakarta Selatan",
    type: "Harian",
    salary: "Rp 150.000 – 200.000/hari",
    status: "accepted",
    appliedAt: "29 Jun 2026",
    cover: "/barista_cover_1782741796312.png",
    isUrgent: false,
    note: "Selamat! Anda diterima. Perekrut akan menghubungi via WhatsApp dalam 1×24 jam.",
  },
  {
    id: "a2",
    title: "Kasir Shift Malam",
    company: "Toko Makmur Jaya",
    companyInitials: "TM",
    companyColor: "bg-indigo-600",
    location: "Bandung",
    type: "Shift",
    salary: "Rp 3.500.000/bulan",
    status: "reviewing",
    appliedAt: "28 Jun 2026",
    cover: "/cashier_cover_1782741807800.png",
    isUrgent: true,
    note: "Lamaran Anda sedang diperiksa oleh tim perekrut.",
  },
  {
    id: "a3",
    title: "Kurir Motor Harian",
    company: "Express Kurir Mandiri",
    companyInitials: "EK",
    companyColor: "bg-teal-600",
    location: "Jakarta",
    type: "Harian",
    salary: "Rp 120.000 – 180.000/hari",
    status: "pending",
    appliedAt: "27 Jun 2026",
    cover: "/courier_cover_1782741835656.png",
    isUrgent: true,
    note: "Lamaran terkirim. Menunggu respons dari perekrut.",
  },
  {
    id: "a4",
    title: "Staff Gudang Shift Pagi",
    company: "PT Gudang Raya",
    companyInitials: "GR",
    companyColor: "bg-slate-500",
    location: "Tangerang",
    type: "Shift",
    salary: "Rp 3.200.000/bulan",
    status: "rejected",
    appliedAt: "25 Jun 2026",
    cover: "/warehouse_cover_1782741851815.png",
    isUrgent: false,
    note: "Teria kasih atas lamaran Anda. Mohon maaf, posisi ini sudah terisi.",
  },
];

// ─── Status Config ────────────────────────────────────────────────
const STATUS: Record<AppStatus, {
  label: string;
  steps: { label: string; done: boolean }[];
  badge: string;
  colorClass: string;
  dot: string;
  icon: React.ReactNode;
}> = {
  accepted: {
    label: "Diterima",
    steps: [
      { label: "Terkirim", done: true },
      { label: "Ditinjau", done: true },
      { label: "Diterima", done: true },
    ],
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    colorClass: "text-emerald-600",
    dot: "bg-emerald-500",
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  reviewing: {
    label: "Sedang Ditinjau",
    steps: [
      { label: "Terkirim", done: true },
      { label: "Ditinjau", done: true },
      { label: "Keputusan", done: false },
    ],
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    colorClass: "text-amber-500",
    dot: "bg-amber-400",
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  pending: {
    label: "Menunggu",
    steps: [
      { label: "Terkirim", done: true },
      { label: "Ditinjau", done: false },
      { label: "Keputusan", done: false },
    ],
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    colorClass: "text-sky-500",
    dot: "bg-sky-400",
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  rejected: {
    label: "Tidak Dilanjutkan",
    steps: [
      { label: "Terkirim", done: true },
      { label: "Ditinjau", done: true },
      { label: "Ditolak", done: false },
    ],
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    colorClass: "text-slate-400",
    dot: "bg-slate-400",
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

const TAB_FILTERS = [
  { id: "all", label: "Semua Lamaran" },
  { id: "accepted", label: "Diterima" },
  { id: "reviewing", label: "Sedang Ditinjau" },
  { id: "pending", label: "Menunggu" },
  { id: "rejected", label: "Tidak Dilanjutkan" },
];

// ─── Progress Stepper ─────────────────────────────────────────────
function Stepper({ steps, status }: { steps: { label: string; done: boolean }[]; status: AppStatus }) {
  const isRejected = status === "rejected";
  const isAccepted = status === "accepted";

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isLastStep = isLast && (isRejected || isAccepted);

        return (
          <div key={i} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center border-2 text-white transition-all text-[9px]",
                step.done
                  ? isRejected && isLastStep
                    ? "bg-slate-300 border-slate-300"
                    : isAccepted
                    ? "bg-emerald-500 border-emerald-500"
                    : i === steps.filter(s => s.done).length - 1
                    ? "bg-sky-500 border-sky-500 ring-2 ring-sky-100"
                    : "bg-slate-350 bg-slate-300 border-slate-300"
                  : "bg-white border-slate-200"
              )}>
                {step.done ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-bold mt-1.5 whitespace-nowrap",
                step.done
                  ? isRejected && isLastStep ? "text-slate-400" : "text-slate-600"
                  : "text-slate-350 text-slate-300"
              )}>
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div className={cn(
                "h-0.5 w-8 mx-1 mb-4 transition-all",
                step.done && steps[i + 1]?.done ? "bg-sky-500/80" : "bg-slate-100"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────
function AppCard({ app }: { app: Application }) {
  const [open, setOpen] = useState(app.status === "accepted");
  const s = STATUS[app.status];
  const isRejected = app.status === "rejected";

  return (
    <div className={cn(
      "bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm flex flex-col",
      isRejected
        ? "border-slate-200 opacity-70"
        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
    )}>
      
      {/* Cover Image Banner */}
      <div className="relative h-40 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={app.cover}
          alt={app.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Urgent and Type Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {app.isUrgent && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
              Urgent
            </span>
          )}
          <span className="px-2.5 py-0.5 bg-white text-slate-800 text-[10px] font-bold rounded-md shadow-sm">
            {app.type}
          </span>
        </div>

        {/* Status Overlay Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shadow bg-white",
            s.badge
          )}>
            {s.icon}
            {s.label}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Profile/Company Overlap & Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm",
              app.companyColor
            )}>
              {app.companyInitials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{app.company}</p>
              <p className="text-[10px] text-slate-400 leading-none">Dilamar {app.appliedAt}</p>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-snug hover:text-sky-600 transition-colors">
              {app.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {app.location}
              </span>
              <span className="font-extrabold text-slate-800">{app.salary}</span>
            </div>
          </div>
        </div>

        {/* Action Row & Stepper */}
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Stepper steps={s.steps} status={app.status} />

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
            >
              {open ? "Sembunyikan" : "Detail"}
              <svg
                className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")}
                fill="none" viewBox="0 0 16 16"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Expandable note */}
          {open && (
            <div className={cn(
              "p-3.5 rounded-xl border text-xs leading-relaxed transition-all animate-slide-down",
              app.status === "accepted" ? "bg-emerald-50 border-emerald-100 text-emerald-800" :
              app.status === "reviewing" ? "bg-amber-50 border-amber-100 text-amber-800" :
              app.status === "pending" ? "bg-sky-50 border-sky-100 text-sky-800" :
              "bg-slate-50 border-slate-100 text-slate-600"
            )}>
              <p className="font-bold">{app.note}</p>
              {app.status === "accepted" && (
                <div className="mt-3">
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.432 5.163L2 22l4.978-1.407A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.063-1.112l-.291-.174-3.018.853.82-3.098-.19-.318A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
                    </svg>
                    Hubungi Perekrut (WhatsApp)
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? mockApplications
    : mockApplications.filter(a => a.status === activeTab);

  const counts = {
    all: mockApplications.length,
    accepted: mockApplications.filter(a => a.status === "accepted").length,
    reviewing: mockApplications.filter(a => a.status === "reviewing").length,
    pending: mockApplications.filter(a => a.status === "pending").length,
    rejected: mockApplications.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Lamaran Saya</h1>
              <p className="text-sm text-slate-500 mt-1">
                Pantau status semua lamaran yang telah Anda kirimkan.
              </p>
            </div>
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Cari Lowongan Baru
            </Link>
          </div>

          {/* Inline stats */}
          <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-900">{counts.all}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{counts.accepted}</p>
              <p className="text-xs text-slate-500 mt-0.5">Diterima</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-amber-500">{counts.reviewing}</p>
              <p className="text-xs text-slate-500 mt-0.5">Ditinjau</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-sky-500">{counts.pending}</p>
              <p className="text-xs text-slate-500 mt-0.5">Menunggu</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-slate-400">{counts.rejected}</p>
              <p className="text-xs text-slate-500 mt-0.5">Tidak Lanjut</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">

        {/* ── TABS ── */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto no-scrollbar border-b border-slate-200">
          {TAB_FILTERS.map(tab => {
            const cnt = counts[tab.id as keyof typeof counts] ?? 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {tab.label}
                {cnt > 0 && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── CARDS LIST ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-slate-300 bg-white">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-700">Belum ada lamaran di sini</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5 max-w-xs">Temukan pekerjaan yang sesuai dan kirim lamaran pertama Anda.</p>
            <Link href="/jobs" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-lg transition-colors">
              Cari Lowongan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="mt-6 flex items-center justify-between px-5 py-4 bg-white border border-slate-200 rounded-xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Tambah lamaran baru</p>
            <p className="text-xs text-slate-500 mt-0.5">Ratusan lowongan baru tersedia setiap harinya.</p>
          </div>
          <Link href="/jobs" className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0">
            Lihat Lowongan →
          </Link>
        </div>
      </div>
    </div>
  );
}
