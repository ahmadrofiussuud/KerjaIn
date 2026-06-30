"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";

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
    emoji: "☕",
  },
  {
    id: "j2",
    title: "Kasir Shift Malam",
    company: "Toko Makmur Jaya",
    location: "Bandung",
    salary: "Rp 3.500.000/bulan",
    type: "Shift",
    is_urgent: false,
    emoji: "🏪",
  },
  {
    id: "j3",
    title: "Kurir Motor Harian",
    company: "Express Kurir Mandiri",
    location: "Jakarta",
    salary: "Rp 120.000 - 180.000/hari",
    type: "Harian",
    is_urgent: true,
    emoji: "🏍️",
  },
  {
    id: "j4",
    title: "Staff Gudang Shift Pagi",
    company: "PT Gudang Raya",
    location: "Tangerang",
    salary: "Rp 3.200.000/bulan",
    type: "Shift",
    is_urgent: false,
    emoji: "📦",
  },
  {
    id: "j5",
    title: "Admin & Customer Service",
    company: "PT Logistik Nusantara",
    location: "Surabaya",
    salary: "Rp 4.000.000 - 5.000.000/bulan",
    type: "Full-time",
    is_urgent: false,
    emoji: "💼",
  },
  {
    id: "j6",
    title: "Tukang Masak Warteg",
    company: "Warteg Bahari",
    location: "Jakarta Pusat",
    salary: "Rp 170.000/hari",
    type: "Harian",
    is_urgent: true,
    emoji: "🍳",
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
      <section id="beranda" className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background gradient blobs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                Platform Kerja Informal Terpercaya #1 Indonesia
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Cari Kerja Harian &{" "}
                <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                  Sampingan
                </span>{" "}
                Lebih Mudah
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                KerjaIn menghubungkan pekerja informal dengan UMKM lokal secara instan. 
                Tanpa CV berlembar-lembar, tanpa perantara, tanpa biaya pendaftaran.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#lowongan"
                  className="px-7 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-0.5 transition-all text-sm"
                >
                  Lihat Lowongan Kerja →
                </a>
                <Link
                  href="/register"
                  className="px-7 py-3.5 bg-white border-2 border-slate-200 hover:border-sky-300 text-slate-800 font-bold rounded-xl hover:shadow-md transition-all text-sm"
                >
                  Daftar Gratis Sekarang
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  100% Gratis untuk Pelamar
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Tanpa Biaya Komisi
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Gaji Harian Transparan
                </span>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 p-6 bg-gradient-to-br from-sky-600 to-cyan-600 rounded-3xl text-white shadow-xl shadow-sky-200">
                <p className="text-sky-100 text-sm font-medium">Total Pekerja Tersalurkan</p>
                <p className="text-5xl font-extrabold mt-1">45.000+</p>
                <p className="text-sky-100 text-xs mt-2">Di seluruh Indonesia 🇮🇩</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-extrabold text-slate-900">12k+</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Pekerja Aktif</p>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-extrabold text-slate-900">1.2k+</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Mitra UMKM</p>
              </div>
              <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-lg">
                <p className="text-3xl font-extrabold">98%</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Tingkat Kepuasan</p>
              </div>
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                <p className="text-3xl font-extrabold text-emerald-700">&lt;2 Jam</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Rata-rata Waktu Rekrut</p>
              </div>
            </div>
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
                className="text-left p-5 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-lg hover:-translate-y-0.5 transition-all group w-full"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors shrink-0">
                      {job.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                    </div>
                  </div>
                  {job.is_urgent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
                      Urgent
                    </span>
                  )}
                </div>

                {/* Info row */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{job.salary}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100">{job.type}</span>
                  </div>
                </div>

                {/* CTA hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Klik untuk melamar</span>
                  <span className="text-sky-600 text-xs font-bold group-hover:translate-x-1 transition-transform inline-block">→</span>
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
