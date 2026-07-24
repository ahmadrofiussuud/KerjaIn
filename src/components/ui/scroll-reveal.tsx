"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;          // ms
  direction?: "up" | "left" | "right" | "scale";
  once?: boolean;
  threshold?: number;
}

/**
 * Wraps children and triggers a CSS reveal animation when the element
 * enters the viewport. Uses IntersectionObserver + CSS class toggling.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("revealed");
          if (once) observer.disconnect();
        } else if (!once) {
          el.classList.remove("revealed");
          el.style.animationDelay = "";
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once, threshold]);

  return (
    <div
      ref={ref}
      data-direction={direction !== "up" ? direction : undefined}
      className={cn("scroll-reveal", className)}
    >
      {children}
    </div>
  );
}
