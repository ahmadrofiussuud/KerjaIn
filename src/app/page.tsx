"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/features/hero-section";
import { Icon } from "@/components/ui/icon";
import { FeaturesOrbit } from "@/components/features/features-orbit";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { JobsSpotlight } from "@/components/features/jobs-spotlight";
import { TestimonialsCarousel } from "@/components/features/testimonials-carousel";

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
    cover: "/barista_realistic.png",
    logo: "/logo_kopi_kenangan.png",
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
    cover: "/cashier_realistic.png",
    logo: "/logo_toko_makmur.png",
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
    cover: "/courier_realistic.png",
    logo: "/logo_express_kurir.png",
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
    cover: "/warehouse_realistic.png",
    logo: "/logo_gudang_raya.png",
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
    cover: "/office_realistic.png",
    logo: "/logo_logistik_nusantara.png",
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
    cover: "/cooking_realistic.png",
    logo: "/logo_warteg_bahari.png",
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

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
      <HeroSection />

      {/* ─── TENTANG KAMI ────────────────────────────────────────── */}
      <section id="tentang" className="py-12 lg:py-16 bg-[#f0f4f8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT: Text card */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-sm space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Tentang Kami</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                  Platform Kerja Informal<br />
                  <span className="text-sky-600">Paling Terpercaya</span> di Indonesia
                </h2>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                KerjaIn lahir dari keresahan nyata — ribuan UMKM kesulitan mencari staf harian yang terpercaya, 
                sementara jutaan pekerja informal tidak punya platform yang tepat untuk menemukan pekerjaan bermartabat.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Kami membangun jembatan digital yang menghubungkan keduanya secara langsung, transparan, 
                dan tanpa birokrasi. Tidak ada komisi tersembunyi, tidak ada perantara berbelit.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 w-full">
                {[
                  { value: "50K+",  label: "Pekerja Terdaftar" },
                  { value: "8K+",   label: "UMKM Mitra" },
                  { value: "50+",   label: "Kota di Indonesia" },
                ].map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <p className="text-3xl sm:text-4xl font-black text-sky-600 tracking-tight">{s.value}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2 w-full">
                <Link href="/register" className="px-7 py-3.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                  Mulai Sekarang
                </Link>
                <a href="#cara-kerja" className="px-7 py-3.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-700 text-sm font-bold rounded-xl transition-all">
                  Lihat Cara Kerjanya
                </a>
              </div>
            </div>

            {/* RIGHT: Polaroid photos layout (with proper spacing & visibility) */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]">
              {/* Radial glow background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-sky-200/40 blur-3xl" />
              </div>

              {/* Mobile stacked view / Desktop overlapping polaroids */}
              <div className="relative w-full max-w-md flex items-center justify-center">

                {/* Polaroid 1 — Back Layer (Rotated Right & Shifted Right so it's fully visible) */}
                <div
                  className="absolute sm:relative bg-white shadow-xl rounded-sm overflow-hidden polaroid-hover transition-all duration-300"
                  style={{
                    width: "250px",
                    padding: "12px 12px 42px 12px",
                    transform: "rotate(8deg) translateX(70px) translateY(-30px)",
                    zIndex: 1,
                  }}
                >
                  <div className="w-full overflow-hidden rounded-xs" style={{ height: "190px" }}>
                    <img
                      src="/about_photo_2.png"
                      alt="Kurir KerjaIn"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 text-center mt-3 tracking-wide">Express Kurir · Jakarta</p>
                </div>

                {/* Polaroid 2 — Front Layer (Rotated Left & Shifted Left) */}
                <div
                  className="absolute bg-white shadow-2xl rounded-sm overflow-hidden polaroid-hover transition-all duration-300"
                  style={{
                    width: "260px",
                    padding: "12px 12px 44px 12px",
                    transform: "rotate(-6deg) translateX(-65px) translateY(25px)",
                    zIndex: 2,
                  }}
                >
                  <div className="w-full overflow-hidden rounded-xs" style={{ height: "205px" }}>
                    <img
                      src="/about_photo_1.png"
                      alt="Pekerja KerjaIn"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 text-center mt-3 tracking-wide">Kasir Toko · Bandung</p>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 transition-transform hover:scale-105"
                  style={{ bottom: "-10px", right: "-10px", zIndex: 10 }}
                >
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Icon name="check_circle" size={20} fill className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Terverifikasi 100%</p>
                    <p className="text-[10px] text-slate-500 font-medium">Identitas &amp; Legalitas UMKM</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FITUR UNGGULAN (ORBIT) ──────────────────────────────── */}
      <FeaturesOrbit />

      {/* ─── CARA KERJA ──────────────────────────────────────────── */}
      <section id="cara-kerja" className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
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
                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Icon name="person" size={20} fill />
                </div>
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
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Icon name="business" size={20} fill />
                </div>
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

      {/* ─── CARI KERJA / PREVIEW LOWONGAN (WHAT WE MADE STYLE) ── */}
      <JobsSpotlight jobs={previewJobs} onJobClick={handleJobClick} />

      {/* ─── TESTIMONIALS (WHAT THEY SAY STYLE) ─────────────────── */}
      <TestimonialsCarousel />

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-14 lg:py-18 bg-slate-900 text-white relative overflow-hidden">
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
              Daftar Gratis Sekarang
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
              <div className="h-14 w-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto">
                <Icon name="key" size={28} fill className="text-sky-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Login Diperlukan</h3>
              <p className="text-sm text-slate-500">Pilih jenis akun Anda untuk melanjutkan melamar kerja atau merekrut staf.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleLoginAs("applicant")}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <Icon name="person" size={20} fill className="text-sky-600" />
                  </div>
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
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Icon name="business" size={20} fill className="text-amber-600" />
                  </div>
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
