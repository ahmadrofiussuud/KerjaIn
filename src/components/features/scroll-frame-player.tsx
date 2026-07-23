"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollFramePlayerProps {
  frameCount?: number;
  className?: string;
}

export function ScrollFramePlayer({ frameCount = 100, className }: ScrollFramePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);

  // Scroll offset target & current (for smooth linear interpolation / lerp)
  const scrollFractionRef = useRef(0);
  const currentFractionRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === frameCount) {
          setIsPreloading(false);
          drawFrame(0); // draw initial frame
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [frameCount]);

  // Handle drawing to canvas
  const drawFrame = (fraction: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(fraction * frameCount)
    );

    const img = imagesRef.current[frameIndex];
    if (img && img.complete) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fit image cover style inside canvas
      const imgWidth = img.width;
      const imgHeight = img.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  // Lerp loop for ultra-smooth animations
  useEffect(() => {
    const updateAnimation = () => {
      // Lerp formula: current = current + (target - current) * speed
      const diff = scrollFractionRef.current - currentFractionRef.current;
      
      // If the difference is extremely small, stop requesting frames
      if (Math.abs(diff) > 0.0005) {
        currentFractionRef.current += diff * 0.15; // 0.15 is interpolation speed
        drawFrame(currentFractionRef.current);
      }

      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    requestRef.current = requestAnimationFrame(updateAnimation);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [imagesLoaded]);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Define scrollable zone: starts when top enters viewport, ends when bottom leaves viewport
      const start = rect.top - windowHeight;
      const end = rect.bottom;
      const total = end - start;

      if (total <= 0) return;

      // Progress value from 0.0 (enters) to 1.0 (leaves)
      let fraction = -start / total;
      fraction = Math.max(0, Math.min(1, fraction));

      scrollFractionRef.current = fraction;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Handle initial calculation
    handleScroll();

    // Resize observer to scale canvas internal dimensions dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = entry.contentRect.width * window.devicePixelRatio;
          canvas.height = entry.contentRect.height * window.devicePixelRatio;
          drawFrame(currentFractionRef.current);
        }
      }
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
      />

      {/* Preloader overlay screen */}
      {isPreloading && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white z-10">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Loading Parallax ({Math.round((imagesLoaded / frameCount) * 100)}%)
          </span>
        </div>
      )}
    </div>
  );
}
