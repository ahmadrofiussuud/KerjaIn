"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
  rating: number;
}

const testimonialsData: TestimonialItem[] = [
  {
    id: "t1",
    quote:
      "Pasang iklan pagi hari, siang sudah dapat barista berpengalaman yang lokasinya dekat kafe. Komunikasi langsung via WhatsApp tanpa perantara!",
    name: "Bu Retno Wulandari",
    role: "Pemilik Kafe Premium",
    location: "Palmerah, Jakarta Barat",
    image: "/about_photo_1.png",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "Sebagai mahasiswa, KerjaIn bantu saya cari kerja sampingan shift barista & kasir. Gaji transparan dan langsung dikirim setelah shift selesai!",
    name: "Dimas Pratama",
    role: "Mahasiswa & Part-Time Staff",
    location: "Coblong, Bandung",
    image: "/barista_realistic.png",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Tidak perlu buat CV yang ribet! Pemilik toko swalayan langsung hubungi saya via WhatsApp. Seminggu setelah daftar langsung aktif bekerja.",
    name: "Budi Santoso",
    role: "Pekerja Lepas Harian",
    location: "Tangerang",
    image: "/courier_realistic.png",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => {
    setActiveIdx((current) => (current === 0 ? testimonialsData.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIdx((current) => (current === testimonialsData.length - 1 ? 0 : current + 1));
  };

  const current = testimonialsData[activeIdx];

  return (
    <section className="py-12 lg:py-16 bg-white border-t border-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Label (WHAT THEY SAY wireframe style) */}
        <div className="text-center space-y-2">
          <p className="text-xs font-extrabold tracking-[0.25em] text-slate-800 uppercase">
            WHAT THEY SAY
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Dipercaya Ribuan Pekerja &amp; UMKM
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center gap-4 sm:gap-6">
          {/* Left Arrow Button (Hidden on tiny mobile, shown sm+) */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="hidden sm:flex h-12 w-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm items-center justify-center shrink-0 transition-transform active:scale-95 hover:scale-105 z-10"
          >
            <Icon name="arrow_back" size={20} />
          </button>

          {/* Main Card Container */}
          <div
            key={current.id}
            className="w-full flex-1 bg-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 transition-all duration-300 animate-slide-up"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
              {/* Left Photo Box */}
              <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-2xl overflow-hidden bg-slate-400 shrink-0 shadow-md">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                {/* Rating Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Icon key={i} name="star" size={20} fill className="text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed italic">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="pt-2 border-t border-slate-300/60">
                  <p className="text-base font-extrabold text-slate-900">{current.name}</p>
                  <p className="text-xs text-slate-600 font-medium">
                    {current.role} • {current.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow Button (Hidden on tiny mobile, shown sm+) */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="hidden sm:flex h-12 w-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm items-center justify-center shrink-0 transition-transform active:scale-95 hover:scale-105 z-10"
          >
            <Icon name="arrow_forward" size={20} />
          </button>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex sm:hidden items-center justify-between gap-4">
          <button
            onClick={prev}
            className="flex-1 py-2.5 bg-slate-100 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-1"
          >
            <Icon name="arrow_back" size={16} /> Prev
          </button>
          <div className="flex items-center gap-1">
            {testimonialsData.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIdx ? "w-4 bg-slate-800" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex-1 py-2.5 bg-slate-100 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-1"
          >
            Next <Icon name="arrow_forward" size={16} />
          </button>
        </div>

        {/* Desktop Indicators */}
        <div className="hidden sm:flex items-center justify-center gap-2 pt-2">
          {testimonialsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIdx ? "w-6 bg-slate-800" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
