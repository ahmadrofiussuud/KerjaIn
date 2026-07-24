"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  is_urgent: boolean;
  cover: string;
  logo: string;
  description: string;
}

interface JobsSpotlightProps {
  jobs: JobItem[];
  onJobClick: () => void;
}

export function JobsSpotlight({ jobs, onJobClick }: JobsSpotlightProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => {
    setActiveIdx((current) => (current === 0 ? jobs.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIdx((current) => (current === jobs.length - 1 ? 0 : current + 1));
  };

  const currentJob = jobs[activeIdx];

  return (
    <section id="lowongan" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Container */}
        <div className="relative bg-[#f1f5f9] rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden border border-slate-200/90 shadow-sm">

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  LOWONGAN TERBARU
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                  Jelajahi Lowongan Kerja &amp; Temukan Peluang Terbaik Anda
                </h2>
              </div>
              <p className="text-slate-600 text-base leading-relaxed">
                Ratusan UMKM terpercaya membuka kesempatan staf harian, shift, dan paruh waktu setiap harinya.
              </p>
              <div className="pt-2">
                <button
                  onClick={onJobClick}
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Lihat Semua Lowongan →
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Card Spotlight */}
            <div className="lg:col-span-7 relative">

              {/* Desktop/Tablet Flex Wrapper with Flanking Arrows */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Prev Button (Hidden on tiny screens, shown on sm+) */}
                <button
                  onClick={prev}
                  aria-label="Previous job"
                  className="hidden sm:flex h-12 w-12 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-md items-center justify-center shrink-0 transition-all active:scale-95 hover:scale-105 z-10"
                >
                  <Icon name="arrow_back" size={20} />
                </button>

                {/* Featured Job Card */}
                <div
                  key={currentJob.id}
                  onClick={onJobClick}
                  className="w-full flex-1 bg-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200/80 cursor-pointer group hover:border-sky-400 transition-all duration-300 animate-slide-up"
                >
                  <div className="grid sm:grid-cols-5 gap-5 items-center">
                    {/* Cover Image */}
                    <div className="sm:col-span-2 relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={currentJob.cover}
                        alt={currentJob.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        {currentJob.is_urgent && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded uppercase tracking-wider shadow-sm">
                            Urgent
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-white text-slate-800 text-[9px] font-bold rounded shadow-sm">
                          {currentJob.type}
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="sm:col-span-3 space-y-3 flex flex-col justify-between h-full text-left">
                      <div>
                        {/* Company Logo */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-100 bg-white shrink-0 shadow-sm">
                            <img
                              src={currentJob.logo}
                              alt={currentJob.company}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-700 truncate">{currentJob.company}</p>
                            <p className="text-[10px] text-slate-400">{currentJob.location}</p>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                          {currentJob.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {currentJob.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">UPAH / GAJI</p>
                          <p className="text-sm font-black text-sky-600">{currentJob.salary}</p>
                        </div>
                        <span className="px-3.5 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg group-hover:bg-sky-500 transition-colors">
                          Lamar Cepat
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Button (Hidden on tiny screens, shown on sm+) */}
                <button
                  onClick={next}
                  aria-label="Next job"
                  className="hidden sm:flex h-12 w-12 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-md items-center justify-center shrink-0 transition-all active:scale-95 hover:scale-105 z-10"
                >
                  <Icon name="arrow_forward" size={20} />
                </button>
              </div>

              {/* Mobile Only Navigation Bar (Shown on small screens) */}
              <div className="flex sm:hidden items-center justify-between gap-4 mt-4">
                <button
                  onClick={prev}
                  aria-label="Previous job"
                  className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:bg-slate-50"
                >
                  <Icon name="arrow_back" size={16} /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {jobs.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeIdx ? "w-4 bg-slate-900" : "w-1.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next job"
                  className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:bg-slate-50"
                >
                  Next <Icon name="arrow_forward" size={16} />
                </button>
              </div>

            </div>
          </div>

          {/* Dots Indicator for Desktop */}
          <div className="hidden sm:flex items-center justify-center gap-1.5 mt-10">
            {jobs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIdx ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to job ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
