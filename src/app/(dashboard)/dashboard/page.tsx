"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────────
type Role = "applicant" | "recruiter";

// ─── Mock data ──────────────────────────────────────────────────
const recruiterStats = [
  { label: "Total Lowongan", value: "8", sub: "4 aktif saat ini", color: "border-l-cyan-500" },
  { label: "Total Pelamar", value: "47", sub: "+12 minggu ini", color: "border-l-sky-500" },
  { label: "Menunggu Review", value: "9", sub: "Perlu ditinjau", color: "border-l-amber-500" },
  { label: "Berhasil Rekrut", value: "23", sub: "Bulan ini", color: "border-l-emerald-500" },
];

const applicantStats = [
  { label: "Lamaran Terkirim", value: "12", sub: "+3 bulan ini", color: "border-l-sky-500" },
  { label: "Sedang Ditinjau", value: "3", sub: "Menunggu keputusan", color: "border-l-amber-500" },
  { label: "Diterima", value: "2", sub: "Kesempatan kerja", color: "border-l-emerald-500" },
  { label: "Profil Dilihat", value: "58", sub: "Oleh perekrut", color: "border-l-violet-500" },
];

const recruiterApplicants = [
  { id: "1", name: "Budi Santoso", position: "Barista Kafe Premium", date: "29 Jun 2026", status: "new", statusText: "Baru" },
  { id: "2", name: "Siti Rahayu", position: "Kasir Shift Malam", date: "28 Jun 2026", status: "reviewing", statusText: "Ditinjau" },
  { id: "3", name: "Ahmad Fauzi", position: "Barista Kafe Premium", date: "27 Jun 2026", status: "accepted", statusText: "Diterima" },
  { id: "4", name: "Dewi Lestari", position: "Staff Gudang Pagi", date: "26 Jun 2026", status: "rejected", statusText: "Ditolak" },
];

const applicantActivity = [
  { id: "1", title: "Barista Kafe Premium", company: "Kopi Kenangan", status: "accepted", statusText: "Diterima", date: "29 Jun" },
  { id: "2", title: "Kasir Shift Malam", company: "Toko Makmur", status: "reviewing", statusText: "Ditinjau", date: "28 Jun" },
  { id: "3", title: "Kurir Motor Harian", company: "Express Kurir", status: "pending", statusText: "Menunggu", date: "27 Jun" },
];

const recruiterJobs = [
  { id: "j1", title: "Barista Kafe Premium", applicants: 14, pending: 3, active: true, daysLeft: 5 },
  { id: "j2", title: "Kasir Shift Malam", applicants: 8, pending: 2, active: true, daysLeft: 12 },
  { id: "j3", title: "Staff Gudang Pagi", applicants: 25, pending: 4, active: true, daysLeft: 3 },
];

const statusBadge: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-slate-100 text-slate-500 border-slate-200",
  pending: "bg-slate-50 text-slate-600 border-slate-200",
};

// ─── Recruiter Dashboard ─────────────────────────────────────────
function RecruiterDashboard({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Selamat datang kembali,</p>
              <h1 className="text-2xl font-extrabold text-slate-900">{name} 👋</h1>
              <p className="text-sm text-slate-500 mt-1">Kelola lowongan dan temukan staf terbaik untuk bisnis Anda.</p>
            </div>
            <Link
              href="/post-job"
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Pasang Lowongan Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recruiterStats.map((s, i) => (
            <div key={i} className={cn("bg-white border border-slate-200 rounded-xl p-5 border-l-4", s.color)}>
              <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Jobs */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Lowongan Aktif</h2>
              <Link href="/manage-jobs" className="text-xs font-semibold text-cyan-600 hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recruiterJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{job.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.applicants} pelamar · {job.pending} menunggu review · Sisa {job.daysLeft} hari
                    </p>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${Math.min((job.applicants / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <Link href="/manage-jobs"
                    className="text-xs font-bold px-3 py-1.5 border border-slate-200 hover:border-cyan-300 hover:text-cyan-700 rounded-lg transition-colors shrink-0">
                    Review
                  </Link>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
              <Link href="/post-job"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors py-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Tambah lowongan baru
              </Link>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Pelamar Terbaru</h2>
              <Link href="/manage-jobs" className="text-xs font-semibold text-cyan-600 hover:underline">
                Semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recruiterApplicants.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-600 shrink-0">
                    {a.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{a.name}</p>
                    <p className="text-xs text-slate-500 truncate">{a.position}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border shrink-0", statusBadge[a.status])}>
                    {a.statusText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Pasang Lowongan", href: "/post-job", icon: "📋", color: "hover:border-cyan-200 hover:bg-cyan-50" },
              { label: "Kelola Lamaran", href: "/manage-jobs", icon: "👥", color: "hover:border-sky-200 hover:bg-sky-50" },
              { label: "Profil Perusahaan", href: "/profile", icon: "🏢", color: "hover:border-slate-300 hover:bg-slate-50" },
              { label: "Pengaturan", href: "/settings", icon: "⚙️", color: "hover:border-slate-300 hover:bg-slate-50" },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className={cn(
                  "flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl transition-all",
                  action.color
                )}>
                <span className="text-xl shrink-0">{action.icon}</span>
                <span className="text-sm font-bold text-slate-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Applicant Dashboard ─────────────────────────────────────────
function ApplicantDashboard({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Selamat datang kembali,</p>
              <h1 className="text-2xl font-extrabold text-slate-900">{name} 👋</h1>
              <p className="text-sm text-slate-500 mt-1">Temukan pekerjaan harian & sampingan yang sesuai dengan Anda.</p>
            </div>
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Cari Lowongan
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {applicantStats.map((s, i) => (
            <div key={i} className={cn("bg-white border border-slate-200 rounded-xl p-5 border-l-4", s.color)}>
              <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Lamaran Terkini</h2>
              <Link href="/applications" className="text-xs font-semibold text-sky-600 hover:underline">
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {applicantActivity.map((app) => (
                <div key={app.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{app.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{app.company} · {app.date}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0", statusBadge[app.status])}>
                    {app.statusText}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
              <Link href="/jobs"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors py-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                Cari lowongan baru
              </Link>
            </div>
          </div>

          {/* Profile completeness */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Kelengkapan Profil</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">75% selesai</span>
                  <span className="text-xs text-sky-600 font-bold">+25%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-sky-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Nama & Info Dasar", done: true },
                  { label: "Nomor Telepon", done: true },
                  { label: "Domisili", done: true },
                  { label: "Keahlian Utama", done: false },
                  { label: "Foto Profil", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      item.done ? "bg-sky-500 border-sky-500" : "border-slate-300"
                    )}>
                      {item.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={cn("text-sm", item.done ? "text-slate-700 font-medium" : "text-slate-400")}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/profile"
                className="block text-center py-2.5 text-sm font-bold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors mt-2">
                Lengkapi Profil
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Cari Lowongan", href: "/jobs", icon: "🔍", color: "hover:border-sky-200 hover:bg-sky-50" },
              { label: "Lamaran Saya", href: "/applications", icon: "📋", color: "hover:border-sky-200 hover:bg-sky-50" },
              { label: "Edit Profil", href: "/profile", icon: "👤", color: "hover:border-slate-300 hover:bg-slate-50" },
              { label: "Pengaturan", href: "/settings", icon: "⚙️", color: "hover:border-slate-300 hover:bg-slate-50" },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className={cn(
                  "flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl transition-all",
                  action.color
                )}>
                <span className="text-xl shrink-0">{action.icon}</span>
                <span className="text-sm font-bold text-slate-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Demo Role Switcher ──────────────────────────────────────────
function DemoSwitcher({ role, onSwitch }: { role: Role; onSwitch: (r: Role) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 bg-white border border-slate-200 shadow-lg rounded-2xl p-3 flex items-center gap-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Demo</span>
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
        {(["applicant", "recruiter"] as Role[]).map((r) => (
          <button key={r} onClick={() => onSwitch(r)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              role === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}>
            {r === "recruiter" ? "Perekrut" : "Pelamar"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role, setRole] = useState<Role>("applicant");
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = (localStorage.getItem("mock_user_role") as Role) || "applicant";
      setRole(stored);
      setLoading(false);

      const handler = (e: Event) => {
        setRole((e as CustomEvent).detail as Role);
      };
      window.addEventListener("mock-role-change", handler);
      return () => window.removeEventListener("mock-role-change", handler);
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setRole((user?.user_metadata?.role as Role) || "applicant");
      setLoading(false);
    });
  }, [isSupabaseConfigured]);

  const handleSwitch = (r: Role) => {
    localStorage.setItem("mock_user_role", r);
    setRole(r);
    window.dispatchEvent(new CustomEvent("mock-role-change", { detail: r }));
  };

  const name = role === "recruiter" ? "Hendra Wijaya" : "Budi Santoso";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-600 animate-pulse" />
          <p className="text-sm text-slate-400 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "recruiter"
        ? <RecruiterDashboard name={name} />
        : <ApplicantDashboard name={name} />}
      {!isSupabaseConfigured && (
        <DemoSwitcher role={role} onSwitch={handleSwitch} />
      )}
    </>
  );
}
