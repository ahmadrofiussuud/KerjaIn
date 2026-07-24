"use client";

import {
  useEffect, useRef, useState, useCallback,
  forwardRef, useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";

export interface ScrollFramePlayerHandle {
  setProgress: (p: number) => void;
}

interface ScrollFramePlayerProps {
  frameCount?: number;
  className?: string;
}

export const ScrollFramePlayer = forwardRef<
  ScrollFramePlayerHandle,
  ScrollFramePlayerProps
>(function ScrollFramePlayer({ frameCount = 100, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imagesRef   = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady]   = useState(false);

  const targetRef  = useRef(0);
  const currentRef = useRef(0);
  const rafRef     = useRef<number | null>(null);

  /* ── draw one frame ── */
  const drawFrame = useCallback((frac: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const idx = Math.min(frameCount - 1, Math.floor(frac * frameCount));
    const img = imagesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const W = canvas.width, H = canvas.height;
    const iR = img.width / img.height;
    const cR = W / H;
    let dW = W, dH = H, dx = 0, dy = 0;
    if (iR > cR) { dW = H * iR; dx = (W - dW) / 2; }
    else          { dH = W / iR; dy = (H - dH) / 2; }

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dW, dH);
  }, [frameCount]);

  /* ── lerp animation loop ── */
  useEffect(() => {
    const loop = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentRef.current += diff * 0.10;
        drawFrame(currentRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [drawFrame]);

  /* ── expose setProgress via imperative handle ── */
  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      targetRef.current = Math.max(0, Math.min(1, p));
    },
  }), []);

  /* ── preload all frames ── */
  useEffect(() => {
    let n = 0;
    const imgs: HTMLImageElement[] = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = () => {
        n++;
        setLoaded(n);
        if (n === frameCount) { setReady(true); drawFrame(0); }
      };
      return img;
    });
    imagesRef.current = imgs;
  }, [frameCount, drawFrame]);

  /* ── resize canvas to container ── */
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const canvas = canvasRef.current;
        if (canvas) {
          const dpr = window.devicePixelRatio || 1;
          canvas.width  = e.contentRect.width  * dpr;
          canvas.height = e.contentRect.height * dpr;
          drawFrame(currentRef.current);
        }
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [drawFrame]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden bg-slate-950", className)}>
      <canvas ref={canvasRef} className="w-full h-full block" />

      {!ready && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-10">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            {Math.round((loaded / frameCount) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
});
