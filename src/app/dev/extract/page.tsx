"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function ExtractFramesPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frameCount, setFrameCount] = useState(100);
  const [status, setStatus] = useState("idle"); // idle, processing, done
  const [progress, setProgress] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setStatus("idle");
      setProgress(0);
      setExtractedCount(0);
    }
  };

  const startExtraction = async () => {
    if (!videoFile) return;

    setStatus("processing");
    setProgress(0);
    setExtractedCount(0);

    // Dynamic load JSZip from CDN to avoid bundling overhead in dev
    if (!(window as any).JSZip) {
      setStatus("loading-deps");
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    setStatus("processing");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const JSZip = (window as any).JSZip;
      const zip = new JSZip();

      // Extract frames at spaced intervals
      const interval = duration / frameCount;

      for (let i = 0; i < frameCount; i++) {
        const time = i * interval;
        
        // Seek video
        video.currentTime = time;
        
        // Wait for seeking to finish
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            resolve();
          };
          video.addEventListener("seeked", onSeeked);
        });

        // Draw current frame to canvas
        ctx.drawImage(video, 0, 0, width, height);

        // Export as Blob
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
        });

        if (blob) {
          const filename = `ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
          zip.file(filename, blob);
          setExtractedCount(i + 1);
          setProgress(Math.round(((i + 1) / frameCount) * 100));
        }
      }

      setStatus("zipping");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Trigger download
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${videoFile.name.replace(/\.[^/.]+$/, "")}-frames.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus("done");
      URL.revokeObjectURL(videoUrl);
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        <div>
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-slate-100">
            Browser MP4 Frames Extractor
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Ekstrak video MP4 apa saja menjadi sequence file JPG secara lokal 100% di browser Anda untuk keperluan efek 2.5D scroll parallax.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pilih File Video (MP4)
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Jumlah Frame Yang Diekstrak
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value) || 100)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          {videoFile && status === "idle" && (
            <button
              onClick={startExtraction}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 text-sm cursor-pointer"
            >
              Ekstrak & Download ZIP
            </button>
          )}

          {status !== "idle" && (
            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-700/50 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-300">
                  {status === "loading-deps" && "Memuat Library Pendukung..."}
                  {status === "processing" && `Mengekstrak Frame (${extractedCount}/${frameCount})...`}
                  {status === "zipping" && "Mengompres menjadi ZIP..."}
                  {status === "done" && "Selesai! File ZIP berhasil diunduh."}
                </span>
                <span className="text-cyan-400 font-extrabold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Hidden elements for extraction rendering */}
        <video ref={videoRef} className="hidden" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30 text-xs text-slate-400 leading-relaxed">
          💡 <strong>Petunjuk Penggunaan:</strong> Ekstrak file zip yang terunduh dan letakkan isinya ke dalam folder <code>/public/frames/</code> dengan struktur penamaan <code>ezgif-frame-001.jpg</code> dst., lalu refresh halaman utama untuk melihat hasilnya.
        </div>
      </div>
    </div>
  );
}
