"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  status: "active" | "closed";
  applicantsCount: number;
  pendingReview: number;
  postedDate: string;
  targetApplicants: number;
}

const mockJobs: JobPosting[] = [
  {
    id: "j1",
    title: "Barista Kafe Premium",
    location: "Jakarta Selatan",
    type: "Harian",
    salary: "Rp 150.000 - 200.000/hari",
    status: "active",
    applicantsCount: 14,
    pendingReview: 3,
    postedDate: "24 Juni 2026",
    targetApplicants: 20,
  },
  {
    id: "j2",
    title: "Kasir Shift Malam",
    location: "Bandung",
    type: "Shift",
    salary: "Rp 3.500.000/bulan",
    status: "active",
    applicantsCount: 8,
    pendingReview: 2,
    postedDate: "25 Juni 2026",
    targetApplicants: 10,
  },
  {
    id: "j3",
    title: "Staff Gudang Shift Pagi",
    location: "Tangerang",
    type: "Shift",
    salary: "Rp 3.200.000/bulan",
    status: "active",
    applicantsCount: 25,
    pendingReview: 4,
    postedDate: "23 Juni 2026",
    targetApplicants: 30,
  },
  {
    id: "j4",
    title: "Tukang Masak Warteg",
    location: "Jakarta Pusat",
    type: "Harian",
    salary: "Rp 170.000/hari",
    status: "closed",
    applicantsCount: 18,
    pendingReview: 0,
    postedDate: "10 Juni 2026",
    targetApplicants: 15,
  },
];

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<string | null>(null);

  const handleDeleteJob = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menutup lowongan ini? Pelamar tidak akan bisa mendaftar lagi.")) {
      setJobs(prev =>
        prev.map(job => (job.id === id ? { ...job, status: "closed" as const } : job))
      );
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === "all") return true;
    return job.status === activeTab;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === "active").length,
    applicants: jobs.reduce((sum, j) => sum + j.applicantsCount, 0),
    pending: jobs.reduce((sum, j) => sum + j.pendingReview, 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                <Link href="/dashboard" className="hover:text-cyan-600">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-600">Kelola Lamaran</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Kelola Lowongan & Lamaran</h1>
              <p className="text-sm text-slate-500 mt-1">Pantau, seleksi pelamar, dan perbarui status iklan lowongan Anda.</p>
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

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mt-8 max-sm:grid-cols-2">
            {[
              { label: "Total Lowongan", value: stats.total, color: "border-l-slate-400 bg-slate-50" },
              { label: "Lowongan Aktif", value: stats.active, color: "border-l-cyan-500 bg-cyan-50/50" },
              { label: "Total Pelamar", value: stats.applicants, color: "border-l-sky-500 bg-sky-50/50" },
              { label: "Menunggu Review", value: stats.pending, color: "border-l-amber-500 bg-amber-50/50" },
            ].map((s, i) => (
              <div key={i} className={cn("px-4 py-3 border-l-4 rounded-xl border border-slate-200 bg-white", s.color)}>
                <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Semua Lowongan" },
            { id: "active", label: "Aktif" },
            { id: "closed", label: "Berakhir / Tutup" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2.5 text-sm font-bold border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors",
                activeTab === tab.id
                  ? "border-cyan-600 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listings */}
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <span className="text-4xl mb-3">📁</span>
            <h3 className="text-sm font-bold text-slate-800">Tidak ada lowongan ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">Anda belum memasang lowongan kerja di kategori ini.</p>
            <Link href="/post-job" className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors">
              Pasang Lowongan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const isActive = job.status === "active";
              const fillPercentage = Math.min((job.applicantsCount / job.targetApplicants) * 100, 100);

              return (
                <div
                  key={job.id}
                  className={cn(
                    "bg-white border rounded-2xl p-5 transition-all",
                    isActive
                      ? "border-slate-200 hover:border-cyan-200 hover:shadow-md"
                      : "border-slate-200 opacity-60"
                  )}
                >
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.location} · {job.type}</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0",
                      isActive
                        ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    )}>
                      {isActive ? "Aktif" : "Tutup"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mb-4">{job.salary}</p>

                  {/* Applicants Progress */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>Pelamar: {job.applicantsCount} / {job.targetApplicants} target</span>
                      <span className="text-cyan-600 font-bold">{Math.round(fillPercentage)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", isActive ? "bg-cyan-500" : "bg-slate-300")}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Stats inside Card */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-5">
                    <div className="text-center border-r border-slate-200">
                      <p className="text-base font-extrabold text-slate-800">{job.applicantsCount}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Total Lamaran</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-base font-extrabold", job.pendingReview > 0 && isActive ? "text-amber-500" : "text-slate-500")}>
                        {job.pendingReview}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Belum Direview</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelectedJobForApplicants(selectedJobForApplicants === job.id ? null : job.id)}
                      className="flex-1 py-2 px-3 border border-slate-200 hover:border-cyan-200 hover:text-cyan-700 font-bold text-xs rounded-xl transition-all text-center cursor-pointer"
                    >
                      {selectedJobForApplicants === job.id ? "Tutup Pelamar" : "Lihat Pelamar"}
                    </button>
                    {isActive && (
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="py-2 px-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        Tutup Lowongan
                      </button>
                    )}
                  </div>

                  {/* Drawer/List of applicants if expanded */}
                  {selectedJobForApplicants === job.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Daftar Pelamar ({job.applicantsCount})</h4>
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                        {[
                          { name: "Budi Santoso", phone: "0812-3456-7890", date: "29 Juni", status: "Baru" },
                          { name: "Siti Rahayu", phone: "0812-9988-7766", date: "28 Juni", status: "Ditinjau" },
                          { name: "Dewi Lestari", phone: "0857-1122-3344", date: "27 Juni", status: "Baru" },
                        ].map((applicant, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{applicant.name}</p>
                              <p className="text-[10px] text-slate-400">{applicant.phone} · {applicant.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={`https://wa.me/${applicant.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                              >
                                Hubungi
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
