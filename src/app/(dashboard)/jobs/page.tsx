"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

import { JobCard } from "@/components/features/job-card";
import { QuickApplyModal } from "@/components/features/quick-apply-modal";
import type { Job, JobType } from "@/types";

// ─── Dummy Data ───
const dummyJobs: Job[] = [
  {
    id: "j1",
    recruiter_id: "r1",
    title: "Barista Kafe Premium",
    description:
      "Dibutuhkan barista berpengalaman untuk kafe premium di area Sudirman. Jam kerja fleksibel, lingkungan kerja modern dan nyaman. Disediakan makan siang dan seragam.",
    salary_range: "Rp 150.000 - 200.000/hari",
    is_urgent: true,
    job_type: "daily",
    location: "Jakarta Selatan",
    created_at: "2026-06-29T06:00:00Z",
    updated_at: "2026-06-29T06:00:00Z",
    profiles: { full_name: "Kopi Kenangan", avatar_url: null },
    cover_url: "/barista_cover_1782741796312.png",
  },
  {
    id: "j2",
    recruiter_id: "r2",
    title: "Kasir Shift Malam",
    description:
      "Minimarket 24 jam membutuhkan kasir untuk shift malam (22:00-06:00). Pengalaman diutamakan namun bukan syarat utama. Training 3 hari disediakan.",
    salary_range: "Rp 3.500.000/bulan",
    is_urgent: false,
    job_type: "shift",
    location: "Bandung",
    created_at: "2026-06-28T10:00:00Z",
    updated_at: "2026-06-28T10:00:00Z",
    profiles: { full_name: "Toko Makmur Jaya", avatar_url: null },
    cover_url: "/cashier_cover_1782741807800.png",
  },
  {
    id: "j3",
    recruiter_id: "r3",
    title: "Admin & Customer Service",
    description:
      "Posisi full-time untuk admin dan CS di perusahaan logistik. Menguasai Microsoft Office dan memiliki kemampuan komunikasi yang baik. BPJS disediakan.",
    salary_range: "Rp 4.000.000 - 5.000.000/bulan",
    is_urgent: false,
    job_type: "full-time",
    location: "Surabaya",
    created_at: "2026-06-28T08:00:00Z",
    updated_at: "2026-06-28T08:00:00Z",
    profiles: { full_name: "PT Logistik Nusantara", avatar_url: null },
    cover_url: "/office_cover_1782741819514.png",
  },
  {
    id: "j4",
    recruiter_id: "r4",
    title: "Kurir Motor Harian",
    description:
      "Dibutuhkan kurir motor untuk pengiriman paket area Jabodetabek. Wajib memiliki SIM C dan motor sendiri. Insentif per paket yang diantar.",
    salary_range: "Rp 120.000 - 180.000/hari",
    is_urgent: true,
    job_type: "daily",
    location: "Jakarta",
    created_at: "2026-06-29T03:00:00Z",
    updated_at: "2026-06-29T03:00:00Z",
    profiles: { full_name: "Express Kurir", avatar_url: null },
    cover_url: "/courier_cover_1782741835656.png",
  },
  {
    id: "j5",
    recruiter_id: "r5",
    title: "Staff Gudang Shift Pagi",
    description:
      "Warehouse assistant untuk shift pagi (06:00–14:00). Packing, sorting, dan loading barang. Lingkungan gudang ber-AC. Lembur dibayar terpisah.",
    salary_range: "Rp 3.200.000/bulan",
    is_urgent: false,
    job_type: "shift",
    location: "Tangerang",
    created_at: "2026-06-27T12:00:00Z",
    updated_at: "2026-06-27T12:00:00Z",
    profiles: { full_name: "PT Gudang Raya", avatar_url: null },
    cover_url: "/warehouse_cover_1782741851815.png",
  },
  {
    id: "j6",
    recruiter_id: "r6",
    title: "Tukang Masak Warteg",
    description:
      "Dibutuhkan juru masak berpengalaman untuk warteg ramai di kawasan perkantoran. Menu masakan rumahan Jawa & Sunda. Bisa mulai besok.",
    salary_range: "Rp 170.000/hari",
    is_urgent: true,
    job_type: "daily",
    location: "Jakarta Pusat",
    created_at: "2026-06-29T05:00:00Z",
    updated_at: "2026-06-29T05:00:00Z",
    profiles: { full_name: "Warteg Bahari", avatar_url: null },
    cover_url: "/cooking_cover_1782741864976.png",
  },
];

const filterChips = [
  { id: "urgent", label: "🔥 Mulai Besok (Urgent)", filter: { type: "is_urgent", value: true } },
  { id: "daily", label: "📅 Kerja Harian", filter: { type: "job_type", value: "daily" } },
  { id: "shift", label: "🌙 Shift Malam", filter: { type: "search", value: "shift" } },
  { id: "fulltime", label: "💼 Full-Time", filter: { type: "job_type", value: "full-time" } },
];

export default function LandingJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  function toggleFilter(chipId: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(chipId)) next.delete(chipId);
      else next.add(chipId);
      return next;
    });
  }

  const filteredJobs = useMemo(() => {
    let result = dummyJobs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q)
      );
    }
    activeFilters.forEach((chipId) => {
      const chip = filterChips.find((c) => c.id === chipId);
      if (!chip) return;
      if (chip.filter.type === "is_urgent") {
        result = result.filter((job) => job.is_urgent === chip.filter.value);
      } else if (chip.filter.type === "job_type") {
        result = result.filter((job) => job.job_type === chip.filter.value);
      } else if (chip.filter.type === "search") {
        const q = String(chip.filter.value).toLowerCase();
        result = result.filter((job) => job.title.toLowerCase().includes(q) || job.description.toLowerCase().includes(q));
      }
    });
    return result;
  }, [searchQuery, activeFilters]);

  async function handleConfirmApply(jobId: string) {
    setApplyingJobId(jobId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApplyingJobId(null);
  }

  return (
    <div className="flex flex-col">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline CTA */}
            <div className="col-span-12 lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold text-sky-700 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                Terintegrasi dengan Ratusan Perekrut UMKM Aktif
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">
                Kerja Harian & Sampingan Cepat{" "}
                <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  Tanpa Ribet
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl max-lg:mx-auto">
                KerjaIn menghubungkan pekerja informal terampil secara langsung dengan UMKM lokal yang membutuhkan tenaga kerja tambahan hari ini juga.
              </p>

              {/* Quick Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl border-t border-slate-100 pt-8 max-sm:grid-cols-1 max-lg:mx-auto">
                {[
                  { label: "Pekerja Aktif", val: "12,450+" },
                  { label: "UMKM Bermitra", val: "1,200+" },
                  { label: "Total Tersalurkan", val: "45,000+" },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Banner Image */}
            <div className="col-span-12 lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none h-[280px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-card border border-slate-200">
                <img
                  src="/hero_banner.png"
                  alt="KerjaIn Kolaborasi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOBS SEARCH & LISTING SECTION ── */}
      <section className="mx-auto max-w-7xl w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Lowongan Pekerjaan Terbaru</h2>
          <p className="text-sm text-slate-500 mt-1">Lamaran langsung dikirimkan ke perekrut tanpa komisi.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari posisi kerja, industri, atau lokasi..."
            className="h-14 w-full rounded-xl pl-12 pr-5 text-sm md:text-base text-slate-800 placeholder:text-slate-400 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
          />
        </div>

        {/* Filter chips (swipeable) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex-shrink-0 mr-2">Filter:</span>
          {filterChips.map((chip) => {
            const isActive = activeFilters.has(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggleFilter(chip.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 flex-shrink-0 text-xs md:text-sm font-medium transition-all min-h-[44px]",
                  isActive
                    ? "bg-sky-50 text-sky-600 border border-sky-200 shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Results Info */}
        <div className="mt-4 mb-8 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <p>Ditemukan <span className="font-semibold text-slate-900">{filteredJobs.length}</span> lowongan sesuai filter</p>
          {(searchQuery || activeFilters.size > 0) && (
            <button onClick={() => { setSearchQuery(""); setActiveFilters(new Set()); }} className="text-sky-600 hover:underline">
              Reset pencarian
            </button>
          )}
        </div>

        {/* CSS Grid for Job Cards */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(id) => {
                  setSelectedJob(job);
                  setIsModalOpen(true);
                }}
                isApplying={applyingJobId === job.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <h3 className="text-lg font-semibold text-slate-800">Tidak ada lowongan ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba hapus filter atau cari kata kunci lain.</p>
          </div>
        )}
      </section>

      {/* Quick Apply Confirmation Modal */}
      <QuickApplyModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={handleConfirmApply}
      />
    </div>
  );
}
