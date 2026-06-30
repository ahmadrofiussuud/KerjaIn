"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Harian");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setJobType("Harian");
      setSalaryMin("");
      setSalaryMax("");
      setStartDate("");
      setEndDate("");
      setIsUrgent(false);
    }, 3000);
  };

  const formattedSalary = () => {
    if (!salaryMin && !salaryMax) return "Rp –";
    if (salaryMin && !salaryMax) return `Rp ${parseInt(salaryMin).toLocaleString("id-ID")}`;
    if (!salaryMin && salaryMax) return `Rp ${parseInt(salaryMax).toLocaleString("id-ID")}`;
    return `Rp ${parseInt(salaryMin).toLocaleString("id-ID")} - ${parseInt(salaryMax).toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/dashboard" className="hover:text-cyan-600">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-600">Pasang Lowongan</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Pasang Lowongan Baru</h1>
            <p className="text-sm text-slate-500">
              Buat iklan lowongan kerja dan dapatkan pekerja harian atau paruh waktu terbaik untuk usaha Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Informasi Lowongan</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                Lowongan berhasil dipasang! Mengalihkan...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Position Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Posisi / Pekerjaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Barista Harian, Kasir Toko Baju, Operator Gudang"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Pekerjaan</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Jelaskan deskripsi tugas, syarat pelamar, jam kerja, dan keuntungan lainnya..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Kerja</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                />
              </div>

              {/* Job Type (Pills) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Pekerjaan</label>
                <div className="flex flex-wrap gap-2">
                  {["Harian", "Shift", "Part-time", "Full-time"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJobType(type)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        jobType === type
                          ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kisaran Gaji / Upah (Rp)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Masukkan nominal angka saja. Contoh: 150000</p>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Urgent Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">🔥 Mulai Besok (Urgent)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Aktifkan jika Anda butuh pekerja secepatnya.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    isUrgent ? "bg-cyan-600" : "bg-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isUrgent ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 text-sm cursor-pointer"
              >
                Pasang Lowongan Pekerjaan
              </button>
            </form>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pratinjau Tampilan</h2>
            
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-40 bg-slate-100 flex items-center justify-center">
                <span className="text-5xl opacity-40">🏢</span>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  {isUrgent && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
                      Urgent
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-bold rounded-full shadow">
                    {jobType}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center text-xs font-extrabold text-cyan-700 shrink-0">
                    HW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Hendra Wijaya</p>
                    <p className="text-[10px] text-slate-400 leading-none">Perekrut Terverifikasi</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {title || "Judul Lowongan Kerja Anda"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {location || "Lokasi kerja akan tampil di sini"}
                  </p>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {description || "Deskripsi pekerjaan yang Anda tulis akan muncul secara realtime di kotak pratinjau ini..."}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold leading-none">UPAH / GAJI</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-1">{formattedSalary()}</p>
                  </div>
                  <button type="button" className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-lg pointer-events-none">
                    Lamar Cepat
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-xs text-cyan-800 leading-relaxed">
              💡 <strong>Tips Pemasangan:</strong> Berikan info gaji yang transparan dan jujur untuk menarik pelamar berkualitas lebih cepat. Rata-rata lowongan harian di KerjaIn mendapatkan pelamar pertama dalam waktu 45 menit.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
