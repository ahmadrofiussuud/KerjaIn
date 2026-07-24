"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ColorKey = "amber" | "sky" | "emerald" | "violet" | "rose" | "teal";

interface Feature {
  id: string;
  num: string;        // "01", "02" … — used instead of emoji icons
  label: string;
  color: ColorKey;
  accentHex: string;  // CSS hex for SVG stroke / inline styles
  title: string;
  desc: string;
  points: string[];
}

const features: Feature[] = [
  {
    id: "cepat",
    num: "01",
    label: "Proses Cepat",
    color: "amber",
    accentHex: "#f59e0b",
    title: "Dari Daftar hingga Kerja dalam 2 Jam",
    desc: "Sistem matching otomatis menghubungkan pelamar dengan lowongan yang tepat secara instan. Tidak ada antrian panjang, tidak ada proses berhari-hari.",
    points: [
      "Matching otomatis berdasarkan lokasi & keahlian",
      "Notifikasi real-time via WhatsApp",
      "Mulai kerja di hari yang sama",
    ],
  },
  {
    id: "verified",
    num: "02",
    label: "Terverifikasi",
    color: "sky",
    accentHex: "#0ea5e9",
    title: "Setiap Akun Diverifikasi Identitasnya",
    desc: "Keamanan adalah prioritas kami. Setiap pelamar dan UMKM wajib melewati proses verifikasi identitas sebelum dapat menggunakan platform.",
    points: [
      "Verifikasi KTP untuk pelamar",
      "Verifikasi NIB/legalitas untuk UMKM",
      "Sistem rating & ulasan transparan",
    ],
  },
  {
    id: "chat",
    num: "03",
    label: "Langsung via WA",
    color: "emerald",
    accentHex: "#10b981",
    title: "Komunikasi Langsung Tanpa Perantara",
    desc: "Perekrut dan pelamar berinteraksi langsung via WhatsApp. Tidak ada biaya komisi, tidak ada agen yang memotong penghasilan Anda.",
    points: [
      "Chat langsung dengan perekrut",
      "Tidak ada komisi tersembunyi",
      "Respons rata-rata di bawah 30 menit",
    ],
  },
  {
    id: "payments",
    num: "04",
    label: "Gaji Transparan",
    color: "violet",
    accentHex: "#8b5cf6",
    title: "Upah Selalu Ditampilkan dengan Jelas",
    desc: "Setiap lowongan wajib mencantumkan kisaran upah. Tidak ada manipulasi, tidak ada pemotongan tersembunyi — gaji yang dijanjikan adalah yang Anda terima.",
    points: [
      "Upah tertera di setiap lowongan",
      "Pembayaran harian atau mingguan",
      "Dilindungi perjanjian kerja digital",
    ],
  },
  {
    id: "badge",
    num: "05",
    label: "Tanpa CV Formal",
    color: "rose",
    accentHex: "#f43f5e",
    title: "Daftar Cukup dengan Nomor HP",
    desc: "Tidak perlu CV panjang atau ijazah. Cukup isi nama, nomor HP, dan keahlian utama Anda. Semua orang berhak mendapat pekerjaan yang layak.",
    points: [
      "Profil singkat selesai dalam 2 menit",
      "Tidak perlu ijazah atau sertifikat",
      "Cocok untuk semua kalangan",
    ],
  },
  {
    id: "location",
    num: "06",
    label: "Berbasis Lokasi",
    color: "teal",
    accentHex: "#14b8a6",
    title: "Temukan Kerja di Sekitar Anda",
    desc: "Filter lowongan berdasarkan jarak dari lokasi Anda. Hemat waktu dan ongkos transportasi dengan bekerja di tempat yang paling dekat.",
    points: [
      "Filter radius 1–50 km dari lokasi",
      "Tampilan peta interaktif",
      "Tersedia di 50+ kota Indonesia",
    ],
  },
];

// ── Color token map ──────────────────────────────────────────────────────────
const C: Record<ColorKey, {
  border: string; text: string; ring: string;
  dotBg: string; iconBg: string; activeBg: string; barBg: string;
  activeBorder: string;
}> = {
  amber:   { border: "border-amber-400",   text: "text-amber-600",   ring: "ring-amber-400",   dotBg: "bg-amber-400",   iconBg: "bg-amber-100",   activeBg: "bg-amber-500",   barBg: "bg-amber-400",   activeBorder: "border-amber-500"   },
  sky:     { border: "border-sky-400",     text: "text-sky-600",     ring: "ring-sky-400",     dotBg: "bg-sky-400",     iconBg: "bg-sky-100",     activeBg: "bg-sky-500",     barBg: "bg-sky-400",     activeBorder: "border-sky-500"     },
  emerald: { border: "border-emerald-400", text: "text-emerald-600", ring: "ring-emerald-400", dotBg: "bg-emerald-400", iconBg: "bg-emerald-100", activeBg: "bg-emerald-500", barBg: "bg-emerald-400", activeBorder: "border-emerald-500" },
  violet:  { border: "border-violet-400",  text: "text-violet-600",  ring: "ring-violet-400",  dotBg: "bg-violet-400",  iconBg: "bg-violet-100",  activeBg: "bg-violet-500",  barBg: "bg-violet-400",  activeBorder: "border-violet-500"  },
  rose:    { border: "border-rose-400",    text: "text-rose-600",    ring: "ring-rose-400",    dotBg: "bg-rose-400",    iconBg: "bg-rose-100",    activeBg: "bg-rose-500",    barBg: "bg-rose-400",    activeBorder: "border-rose-500"    },
  teal:    { border: "border-teal-400",    text: "text-teal-600",    ring: "ring-teal-400",    dotBg: "bg-teal-400",    iconBg: "bg-teal-100",    activeBg: "bg-teal-500",    barBg: "bg-teal-400",    activeBorder: "border-teal-500"    },
};

// ── Orbit geometry ───────────────────────────────────────────────────────────
// Container 380×380, center (190,190), orbit radius 148, node size 58px
const ORBIT_R = 148;
const CX = 190;
const CY = 190;
const NODE_HALF = 29;

const nodePositions = features.map((_, i) => {
  const angle = (i * 60 - 90) * (Math.PI / 180);
  const x = CX + ORBIT_R * Math.cos(angle);
  const y = CY + ORBIT_R * Math.sin(angle);
  return { left: x - NODE_HALF, top: y - NODE_HALF, cx: x, cy: y };
});

// ── Component ────────────────────────────────────────────────────────────────
export function FeaturesOrbit() {
  const [active, setActive] = useState(0);
  const [contentKey, setContentKey] = useState(0);

  const handleSelect = (idx: number) => {
    if (idx === active) return;
    setContentKey(k => k + 1);
    setActive(idx);
  };

  const feat = features[active];
  const color = C[feat.color];

  return (
    <section id="fitur" className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide">
            Keunggulan Platform
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900">Mengapa Memilih KerjaIn?</h2>
          <p className="text-slate-500 text-base">Pilih salah satu fitur di bawah untuk melihat detail selengkapnya</p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── LEFT: Orbit visualization ─────────────────────────────── */}
          <div
            className="hidden lg:block shrink-0 relative select-none"
            style={{ width: 380, height: 380 }}
          >
            {/* SVG — orbit ring + connector lines */}
            <svg width="380" height="380" className="absolute inset-0 pointer-events-none overflow-visible">
              {/* Main orbit ring — solid, visible */}
              <circle
                cx={CX} cy={CY} r={ORBIT_R}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="8 5"
              />
              {/* Lines from center to every node (dim) */}
              {nodePositions.map((pos, i) => (
                <line
                  key={i}
                  x1={CX} y1={CY} x2={pos.cx} y2={pos.cy}
                  stroke={i === active ? features[i].accentHex : "#cbd5e1"}
                  strokeWidth={i === active ? 2 : 1}
                  strokeDasharray="5 4"
                  opacity={i === active ? 1 : 0.5}
                  style={{ transition: "all 0.5s ease" }}
                />
              ))}
            </svg>

            {/* Center circle — KerjaIn brand */}
            <div
              className="absolute rounded-full bg-white border-2 border-sky-400 shadow-md flex flex-col items-center justify-center"
              style={{ width: 72, height: 72, left: CX - 36, top: CY - 36, zIndex: 5 }}
            >
              <span className="absolute inset-0 rounded-full bg-sky-100 animate-ping opacity-20" style={{ animationDuration: "3s" }} />
              <span className="text-xl font-black text-sky-600 leading-none">K</span>
              <span className="text-[7px] font-bold text-slate-400 tracking-[0.2em] leading-none mt-0.5">KERJA</span>
            </div>

            {/* Orbital nodes */}
            {features.map((f, i) => {
              const pos = nodePositions[i];
              const c = C[f.color];
              const isActive = i === active;
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelect(i)}
                  title={f.label}
                  style={{
                    width: 58,
                    height: 58,
                    left: pos.left,
                    top: pos.top,
                    zIndex: isActive ? 10 : 4,
                    backgroundColor: isActive ? feat.accentHex : "#ffffff",
                    borderColor: isActive ? "transparent" : f.accentHex,
                    boxShadow: isActive
                      ? `0 0 0 5px ${f.accentHex}30, 0 4px 16px ${f.accentHex}50`
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    color: isActive ? "#ffffff" : f.accentHex,
                    transform: isActive ? "scale(1.18)" : "scale(1)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                  className="absolute flex flex-col items-center justify-center rounded-full border-2 cursor-pointer focus:outline-none"
                >
                  {/* Number label */}
                  <span className="text-sm font-black leading-none tracking-tighter">{f.num}</span>
                  {/* Pulse ring on active */}
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-25"
                      style={{ backgroundColor: f.accentHex, animationDuration: "1.8s" }}
                    />
                  )}
                </button>
              );
            })}

            {/* Node labels — outside orbit */}
            {features.map((f, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const LABEL_R = 200;
              const lx = CX + LABEL_R * Math.cos(angle);
              const ly = CY + LABEL_R * Math.sin(angle);
              const isActive = i === active;
              return (
                <span
                  key={`lbl-${f.id}`}
                  className="absolute text-[10px] font-bold text-center leading-tight whitespace-nowrap pointer-events-none transition-all duration-300"
                  style={{
                    left: lx,
                    top: ly,
                    transform: "translate(-50%, -50%)",
                    color: isActive ? f.accentHex : "#64748b",
                    fontWeight: isActive ? 800 : 600,
                  }}
                >
                  {f.label}
                </span>
              );
            })}
          </div>

          {/* ── RIGHT: Detail card ────────────────────────────────────── */}
          <div className="flex-1 w-full max-w-lg">
            <div key={contentKey} className="space-y-6 orbit-content-enter">

              {/* Number + heading */}
              <div className="flex items-start gap-4">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: `${feat.accentHex}18`, border: `2px solid ${feat.accentHex}40` }}
                >
                  <span
                    className="text-xl font-black"
                    style={{ color: feat.accentHex }}
                  >
                    {feat.num}
                  </span>
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: feat.accentHex }}
                  >
                    {feat.label}
                  </p>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-snug">{feat.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-500 text-base leading-relaxed">{feat.desc}</p>

              {/* Bullet points with stagger */}
              <ul className="space-y-3">
                {feat.points.map((pt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 orbit-point-enter"
                    style={{ animationDelay: `${0.12 + i * 0.1}s` }}
                  >
                    <div
                      className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${feat.accentHex}20` }}
                    >
                      {/* Simple SVG check mark — no Material Symbols */}
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke={feat.accentHex}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-700 text-sm leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Dot progress + counter */}
              <div className="flex items-center gap-2 pt-2">
                {features.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className="h-1.5 rounded-full cursor-pointer transition-all duration-300"
                    style={{
                      width: i === active ? 32 : 6,
                      backgroundColor: i === active ? feat.accentHex : "#cbd5e1",
                    }}
                    aria-label={`Lihat ${f.label}`}
                  />
                ))}
                <span className="ml-2 text-[10px] text-slate-400 font-semibold">
                  {active + 1} / {features.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: tab strip ─────────────────────────────────────── */}
        <div className="flex lg:hidden flex-wrap justify-center gap-2 mt-10">
          {features.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.id}
                onClick={() => handleSelect(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border-2 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isActive ? f.accentHex : "#ffffff",
                  borderColor: f.accentHex,
                  color: isActive ? "#ffffff" : f.accentHex,
                  boxShadow: isActive ? `0 4px 12px ${f.accentHex}40` : "none",
                }}
              >
                <span className="font-black">{f.num}</span>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
