"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { ScrollFramePlayer } from "@/components/features/scroll-frame-player";

// Preview jobs for landing page (hanya sebagai teaser)
const previewJobs = [
  {
    id: "j1",
    title: "Barista Kafe Premium",
    company: "Kopi Kenangan Mantan",
    location: "Jakarta Selatan",
    salary: "Rp 150.000 - 200.000/hari",
    type: "Harian",
    is_urgent: true,
    cover: "/barista_cover_1782741796312.png",
    companyInitials: "KK",
    companyColor: "bg-amber-600",
    description: "Dibutuhkan barista berpengalaman untuk kafe premium di area Sudirman. Jam kerja fleksibel, lingkungan kerja modern.",
  },
  {
    id: "j2",
    title: "Kasir Shift Malam",
    company: "Toko Makmur Jaya",
    location: "Bandung",
    salary: "Rp 3.500.000/bulan",
    type: "Shift",
    is_urgent: false,
    cover: "/cashier_cover_1782741807800.png",
    companyInitials: "TM",
    companyColor: "bg-indigo-600",
    description: "Dibutuhkan kasir untuk toko swalayan lokal shift malam (22:00-06:00). Diutamakan jujur, ramah, dan teliti.",
  },
  {
    id: "j3",
    title: "Kurir Motor Harian",
    company: "Express Kurir Mandiri",
    location: "Jakarta",
    salary: "Rp 120.000 - 180.000/hari",
    type: "Harian",
    is_urgent: true,
    cover: "/courier_cover_1782741835656.png",
    companyInitials: "EK",
    companyColor: "bg-teal-600",
    description: "Dicari kurir motor harian untuk pengantaran paket logistik area Jabodetabek. Wajib memiliki SIM C aktif.",
  },
  {
    id: "j4",
    title: "Staff Gudang Shift Pagi",
    company: "PT Gudang Raya",
    location: "Tangerang",
    salary: "Rp 3.200.000/bulan",
    type: "Shift",
    is_urgent: false,
    cover: "/warehouse_cover_1782741851815.png",
    companyInitials: "GR",
    companyColor: "bg-slate-500",
    description: "Membantu operasional gudang, packing barang, loading/unloading, dan pencatatan stock opname shift pagi.",
  },
  {
    id: "j5",
    title: "Admin & Customer Service",
    company: "PT Logistik Nusantara",
    location: "Surabaya",
    salary: "Rp 4.000.000 - 5.000.000/bulan",
    type: "Full-time",
    is_urgent: false,
    cover: "/office_cover_1782741819514.png",
    companyInitials: "LN",
    companyColor: "bg-sky-600",
    description: "Mengelola administrasi pengiriman, menjawab pertanyaan customer via WhatsApp chat secara ramah dan profesional.",
  },
  {
    id: "j6",
    title: "Tukang Masak Warteg",
    company: "Warteg Bahari",
    location: "Jakarta Pusat",
    salary: "Rp 170.000/hari",
    type: "Harian",
    is_urgent: true,
    cover: "/cooking_cover_1782741864976.png",
    companyInitials: "WB",
    companyColor: "bg-emerald-600",
    description: "Mencari juru masak berpengalaman untuk warteg sibuk. Mampu memasak masakan rumah dengan rasa yang konsisten.",
  },
];

const howItWorksApplicant = [
  {
    step: "01",
    title: "Buat Profil Singkat",
    desc: "Daftar dalam 2 menit. Isi nama, nomor HP, dan keahlian utama Anda. Tidak perlu CV panjang lebar.",
    color: "bg-sky-50 border-sky-200 text-sky-600",
  },
  {
    step: "02",
    title: "Cari & Pilih Lowongan",
    desc: "Browse ratusan lowongan harian & paruh waktu terdekat. Filter berdasarkan jenis kerja, gaji, dan lokasi.",
    color: "bg-cyan-50 border-cyan-200 text-cyan-600",
  },
  {
    step: "03",
    title: "Lamar 1-Klik & Kerja!",
    desc: "Kirim lamaran seketika. Perekrut langsung menghubungi via WhatsApp. Mulai kerja dalam hitungan jam.",
    color: "bg-emerald-50 border-emerald-200 text-emerald-600",
  },
];

const howItWorksRecruiter = [
  {
    step: "01",
    title: "Daftarkan Usaha Anda",
    desc: "Verifikasi identitas UMKM dengan mudah. Tidak perlu biaya apapun untuk memulai rekrutmen.",
    color: "bg-amber-50 border-amber-200 text-amber-600",
  },
  {
    step: "02",
    title: "Pasang Iklan Lowongan",
    desc: "Buat iklan lowongan dalam 2 menit. Tentukan posisi, gaji, dan jadwal kerja yang Anda butuhkan.",
    color: "bg-orange-50 border-orange-200 text-orange-600",
  },
  {
    step: "03",
    title: "Pilih & Hubungi Pelamar",
    desc: "Terima lamaran dari pekerja terverifikasi. Saring kandidat terbaik dan hubungi langsung via WhatsApp.",
    color: "bg-rose-50 border-rose-200 text-rose-600",
  },
];

const testimonials = [
  {
    quote: "Pasang iklan pagi hari, siang sudah dapat barista yang lokasinya dekat kafe. Prosesnya cepat banget!",
    name: "Bu Retno Wulandari",
    role: "Pemilik Kafe, Palmerah",
    initials: "RW",
    bg: "bg-cyan-50 border-cyan-100",
    avatar: "bg-cyan-100 text-cyan-700",
  },
  {
    quote: "Sebagai mahasiswa, KerjaIn bantu saya cari kerja sampingan shift barista. Gaji langsung cair setelah shift!",
    name: "Dimas Pratama",
    role: "Mahasiswa & Pekerja Part-time",
    initials: "DP",
    bg: "bg-sky-50 border-sky-100",
    avatar: "bg-sky-100 text-sky-700",
  },
  {
    quote: "Tidak perlu buat CV! Pemilik toko langsung hubungi saya via WhatsApp. Seminggu langsung kerja.",
    name: "Budi Santoso",
    role: "Pekerja Lepas Harian",
    initials: "BS",
    bg: "bg-emerald-50 border-emerald-100",
    avatar: "bg-emerald-100 text-emerald-700",
  },
];

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleJobClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginAs = (role: "applicant" | "recruiter") => {
    localStorage.setItem("mock_user_role", role);
    window.dispatchEvent(new CustomEvent("mock-role-change", { detail: role }));
    setShowLoginModal(false);
    if (role === "applicant") {
      router.push("/jobs");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO / BERANDA ─────────────────────────────────────── */}
      <section id="beranda" className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* Fullscreen Parallax Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <ScrollFramePlayer frameCount={100} scrollMode="viewport" className="w-full h-full border-0 rounded-none bg-slate-950" />
          {/* High contrast overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-slate-950/80 pointer-events-none" />
        </div>

        {/* Floating Cards (positioned strategically, hidden on mobile for clean style) */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block max-w-7xl mx-auto px-8">
          {/* Floating Card 1: Gaji Harian */}
          <div className="absolute top-[22%] left-[8%] bg-slate-900/85 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-bounce-slow">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-lg">
              💰
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Gaji Harian Cair</h4>
              <p className="text-[10px] text-slate-300 mt-0.5">Dana aman & cepat cair</p>
            </div>
          </div>

          {/* Floating Card 2: Verifikasi KTP */}
          <div className="absolute top-[45%] right-[8%] bg-slate-900/85 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Verifikasi KTP</h4>
              <p className="text-[10px] text-slate-300 mt-0.5">Pekerja & UMKM terpercaya</p>
            </div>
          </div>

          {/* Floating Card 3: Tanpa Biaya Komisi */}
          <div className="absolute bottom-[20%] left-[12%] bg-slate-900/85 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-bounce-slow" style={{ animationDelay: "1s" }}>
            <div className="h-10 w-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-lg">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Tanpa Biaya Komisi</h4>
              <p className="text-[10px] text-slate-300 mt-0.5">100% Upah milik pekerja</p>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-bold mb-8 shadow-lg shadow-sky-950/50 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Platform Kerja Informal Terpercaya #1 Indonesia
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white max-w-3xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            Cari Kerja Harian &{" "}
            <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Sampingan
            </span>{" "}
            Lebih Mudah
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl mt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
            KerjaIn menghubungkan pekerja informal dengan UMKM lokal secara instan. 
            Tanpa CV berlembar-lembar, tanpa perantara, tanpa biaya pendaftaran.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 w-full mt-10">
            <a
              href="#lowongan"
              className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-2xl shadow-lg shadow-sky-950/50 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-0.5 transition-all text-sm tracking-wider uppercase cursor-pointer"
            >
              Lihat Lowongan Kerja →
            </a>
            <Link
              href="/register"
              className="px-8 py-4 bg-slate-900/90 border border-slate-700/80 hover:border-sky-500 text-white font-extrabold rounded-2xl hover:bg-slate-950 transition-all text-sm tracking-wider uppercase backdrop-blur-sm"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs font-bold text-slate-200 w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-slate-950/50 py-3.5 px-6 rounded-2xl border border-slate-800/40 backdrop-blur-sm max-w-2xl">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              100% Gratis untuk Pelamar
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Tanpa Biaya Komisi
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Gaji Harian Transparan
            </span>
          </div>
        </div>
      </section>

      {/* ─── TENTANG KAMI ────────────────────────────────────────── */}
      <section id="tentang" className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
                Tentang KerjaIn
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                Kami Hadir untuk <span className="text-sky-600">Menyederhanakan</span> Rekrutmen Informal
              </h2>
              <p className="text-slate-600 leading-relaxed">
                KerjaIn lahir dari keresahan nyata — ribuan UMKM kesulitan mencari staf harian yang terpercaya, 
                sementara jutaan pekerja informal tidak punya platform yang tepat untuk menemukan pekerjaan bermartabat.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Kami membangun jembatan digital yang menghubungkan keduanya secara langsung, transparan, 
                dan tanpa birokrasi. Tidak ada komisi tersembunyi, tidak ada perantara berbelit.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/register" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl transition-all">
                  Mulai Perjalanan Anda
                </Link>
                <a href="#cara-kerja" className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-all">
                  Lihat Cara Kerjanya
                </a>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: "⚡", title: "Proses Cepat", desc: "Dari daftar hingga dapat kerja bisa selesai dalam 2 jam." },
                { icon: "🔒", title: "Terverifikasi & Aman", desc: "Setiap pelamar dan UMKM diverifikasi identitasnya untuk keamanan bersama." },
                { icon: "💬", title: "Komunikasi Langsung", desc: "Tidak ada perantara. Perekrut dan pelamar berinteraksi langsung via WhatsApp." },
                { icon: "💰", title: "Gaji Transparan", desc: "Nominal upah selalu ditampilkan jelas. Tidak ada manipulasi atau pemotongan tersembunyi." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-sky-200 hover:shadow-sm transition-all">
                  <div className="text-2xl shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARA KERJA ──────────────────────────────────────────── */}
      <section id="cara-kerja" className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
              Cara Kerja
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Semudah 1-2-3</h2>
            <p className="text-slate-500 text-base">Proses yang berbeda dan disesuaikan untuk setiap tipe pengguna.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Applicant steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg">👤</div>
                <h3 className="text-xl font-bold text-slate-900">Untuk Pencari Kerja</h3>
              </div>
              {howItWorksApplicant.map((step, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${step.color} flex gap-4 items-start`}>
                  <span className="text-2xl font-black opacity-30 shrink-0">{step.step}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/register" className="block text-center mt-4 px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all text-sm">
                Daftar sebagai Pencari Kerja →
              </Link>
            </div>

            {/* Recruiter steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">🏢</div>
                <h3 className="text-xl font-bold text-slate-900">Untuk Pemilik UMKM</h3>
              </div>
              {howItWorksRecruiter.map((step, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${step.color} flex gap-4 items-start`}>
                  <span className="text-2xl font-black opacity-30 shrink-0">{step.step}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/register" className="block text-center mt-4 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all text-sm">
                Daftar sebagai Perekrut UMKM →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARI KERJA / PREVIEW LOWONGAN ──────────────────────── */}
      <section id="lowongan" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-3">
                Cari Kerja
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900">Lowongan Terbaru</h2>
              <p className="text-slate-500 text-sm mt-1">Klik lowongan untuk melamar — login diperlukan untuk melamar.</p>
            </div>
            <button
              onClick={handleJobClick}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition-all shrink-0"
            >
              Lihat Semua Lowongan →
            </button>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewJobs.map((job) => (
              <button
                key={job.id}
                onClick={handleJobClick}
                className="text-left bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group w-full overflow-hidden flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="relative w-full h-36 overflow-hidden bg-slate-100 border-b border-slate-200 shrink-0">
                  <img
                    src={job.cover}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badges on Cover */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                    {job.is_urgent && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                        Urgent
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-white text-slate-800 text-[9px] font-bold rounded-md shadow-sm">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Company Info */}
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm",
                        job.companyColor
                      )}>
                        {job.companyInitials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 leading-none">{job.company}</p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-none">{job.location}</p>
                      </div>
                    </div>

                    {/* Position & Description */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-sky-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Salary & Action hint */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider leading-none text-slate-400">Upah / Gaji</p>
                      <p className="text-xs font-black text-sky-600 mt-1">{job.salary}</p>
                    </div>
                    <span className="px-3 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg group-hover:bg-sky-500 transition-colors shrink-0">
                      Lamar Cepat
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Login prompt banner */}
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-3xl p-8 text-white text-center space-y-4">
            <h3 className="text-2xl font-extrabold">Mau Melamar? Login Dulu, Bos! 🙌</h3>
            <p className="text-sky-100 text-sm max-w-md mx-auto">
              Buat akun gratis untuk melamar lowongan, pantau status lamaran, dan terima notifikasi real-time.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/register"
                className="px-6 py-3 bg-white text-sky-600 hover:bg-sky-50 font-bold rounded-xl text-sm transition-all shadow-lg">
                Daftar Gratis Sekarang
              </Link>
              <Link href="/login"
                className="px-6 py-3 bg-sky-700/50 hover:bg-sky-700/70 text-white border border-sky-400/50 font-bold rounded-xl text-sm transition-all">
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
              Testimoni
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Dipercaya Ribuan Pengguna</h2>
            <p className="text-slate-500 text-sm">Cerita nyata dari pekerja dan pemilik UMKM yang merasakan manfaatnya.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${t.bg}`}>
                <div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${t.avatar}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Siap Memulai <span className="text-sky-400">Perjalanan Anda</span> Bersama Kami?
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Bergabung gratis sekarang. Temukan pekerjaan sampingan atau staf UMKM terbaik dalam hitungan menit.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/register"
              className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-900/40 hover:-translate-y-0.5 transition-all">
              Daftar Gratis Sekarang ✨
            </Link>
            <Link href="/login"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-xl transition-all">
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ─── LOGIN GATE MODAL ─────────────────────────────────────── */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-5 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="h-14 w-14 bg-sky-100 rounded-2xl flex items-center justify-center text-2xl mx-auto">🔑</div>
              <h3 className="text-xl font-extrabold text-slate-900">Login Diperlukan</h3>
              <p className="text-sm text-slate-500">Pilih jenis akun Anda untuk melanjutkan melamar kerja atau merekrut staf.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleLoginAs("applicant")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm">Saya Pencari Kerja</p>
                    <p className="text-xs text-slate-500">Cari & lamar lowongan harian</p>
                  </div>
                </div>
                <span className="text-sky-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => handleLoginAs("recruiter")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏢</span>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm">Saya Pemilik UMKM</p>
                    <p className="text-xs text-slate-500">Rekrut staf & kelola lowongan</p>
                  </div>
                </div>
                <span className="text-amber-500 font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full text-sm text-slate-400 hover:text-slate-600 py-1 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
