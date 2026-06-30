"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, JobTypeBadge } from "@/components/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import type { Job } from "@/types";

interface QuickApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: string) => Promise<void> | void;
}

/**
 * Quick Apply Modal — Minimalist confirmation dialog.
 * Shows the job summary and the applicant's pre-saved profile,
 * with a single "Konfirmasi Lamaran" button.
 */
function QuickApplyModal({
  job,
  isOpen,
  onClose,
  onConfirm,
}: QuickApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleConfirm() {
    if (!job) return;
    setIsSubmitting(true);
    try {
      await onConfirm(job.id);
      setIsSuccess(true);
      // Auto-close after 1.5s on success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    setIsSuccess(false);
    onClose();
  }

  if (!job) return null;

  const recruiterName = job.profiles?.full_name || "Perusahaan";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlay={!isSubmitting}>
      {/* ── Success State ── */}
      {isSuccess ? (
        <div className="flex flex-col items-center gap-4 px-6 py-10">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              "bg-success-50 text-success-500",
              "animate-fade-in"
            )}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-deep-700 dark:text-slate-100">
              Lamaran Terkirim!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Lamaran Anda untuk posisi{" "}
              <span className="font-medium text-deep-700 dark:text-slate-200">
                {job.title}
              </span>{" "}
              telah berhasil dikirim.
            </p>
          </div>
        </div>
      ) : (
        <>
          <ModalHeader onClose={handleClose}>
            <h3 className="text-lg font-bold text-deep-700 dark:text-slate-100">
              Lamar Cepat
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Konfirmasi lamaran Anda
            </p>
          </ModalHeader>

          <ModalBody>
            {/* ── Job Summary Card ── */}
            <div
              className={cn(
                "rounded-xl border border-border bg-muted p-4",
                "mb-4"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {job.profiles?.avatar_url ? (
                  <img
                    src={job.profiles.avatar_url}
                    alt={recruiterName}
                    className="h-11 w-11 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-lg flex-shrink-0",
                      "bg-deep-700 text-sm font-bold text-cyan-400"
                    )}
                  >
                    {recruiterName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-deep-700 dark:text-slate-100 leading-snug">
                    {job.title}
                  </h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {recruiterName}
                    {job.location && (
                      <>
                        <span className="mx-1 text-slate-300">•</span>
                        {job.location}
                      </>
                    )}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {job.is_urgent && <Badge variant="urgent">Urgent</Badge>}
                    <JobTypeBadge type={job.job_type} />
                    {job.salary_range && (
                      <span className="text-xs font-semibold text-deep-700 dark:text-slate-300">
                        {job.salary_range}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Profile Summary ── */}
            <div className="rounded-xl border border-border bg-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Profil Anda
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Nama", value: "Ahmad Rizky Pratama" },
                  { label: "Telepon", value: "0812-3456-7890" },
                  { label: "Lokasi", value: "Jakarta Selatan" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-deep-700 dark:text-slate-200">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Data ini diambil dari profil Anda.{" "}
                <a
                  href="/profile"
                  className="text-cyan-600 hover:text-cyan-500 underline"
                >
                  Edit profil
                </a>
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Konfirmasi Lamaran"}
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}

export { QuickApplyModal };
export type { QuickApplyModalProps };
