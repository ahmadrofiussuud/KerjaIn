"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** If true, clicking the overlay closes the modal */
  closeOnOverlay?: boolean;
}

/**
 * Modal — accessible overlay dialog with backdrop blur.
 * Uses portal-free rendering (placed in-tree) with focus trap.
 */
function Modal({
  isOpen,
  onClose,
  children,
  className,
  closeOnOverlay = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Focus the modal
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center max-md:items-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-deep-950/60 backdrop-blur-sm",
          "animate-fade-in"
        )}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-md",
          "rounded-2xl border border-border bg-card p-0",
          "shadow-elevated",
          "animate-slide-up max-md:rounded-b-none max-md:border-b-0",
          "focus:outline-none",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Sub-components for semantic structure ── */

function ModalHeader({
  children,
  className,
  onClose,
}: {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 pt-6 pb-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg", // 44px min touch target
            "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
            "dark:hover:bg-slate-800 dark:hover:text-slate-300",
            "transition-colors duration-150 cursor-pointer"
          )}
          aria-label="Tutup"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 pb-2", className)}>{children}</div>;
}

function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 pt-4 pb-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
export type { ModalProps };
