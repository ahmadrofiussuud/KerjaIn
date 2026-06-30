import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, JobTypeBadge } from "@/components/ui/badge";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  isApplying?: boolean;
  className?: string;
}

/**
 * JobCard — displays a single job listing.
 * Desktop-first: base styles target ≥1024px. Add max-lg:/max-md: for smaller.
 */
function JobCard({ job, onApply, isApplying = false, className }: JobCardProps) {
  const recruiterName = job.profiles?.full_name || "Perusahaan";
  const recruiterInitial = recruiterName.charAt(0).toUpperCase();

  return (
    <article
      className={cn(
        // Card container
        "group relative flex flex-col justify-between overflow-hidden",
        "rounded-2xl border border-border bg-card shadow-soft",
        "transition-all duration-300 ease-out",
        "hover:shadow-card hover:-translate-y-1",
        "hover:border-sky-500/30",
        // Urgent cards get a left accent stripe
        job.is_urgent && "border-l-[3px] border-l-urgent-500",
        className
      )}
    >
      {/* ── Top Cover Image Section ── */}
      {job.cover_url && (
        <div className="relative w-full h-36 overflow-hidden bg-slate-100 border-b border-border">
          <img
            src={job.cover_url}
            alt={job.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
            {job.is_urgent && <Badge variant="urgent">Urgent</Badge>}
            <JobTypeBadge type={job.job_type} />
          </div>
        </div>
      )}

      {/* ── Content Wrapper ── */}
      <div className="flex flex-col gap-4 p-5 flex-1 justify-between">
        {/* Company & Job Title Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar placeholder */}
            {job.profiles?.avatar_url ? (
              <img
                src={job.profiles.avatar_url}
                alt={recruiterName}
                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
                  "bg-slate-100 text-sm font-bold text-sky-600 border border-slate-200"
                )}
              >
                {recruiterInitial}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "text-base font-extrabold text-slate-900 leading-snug",
                  "group-hover:text-sky-600",
                  "transition-colors duration-200",
                  "line-clamp-1"
                )}
              >
                {job.title}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-slate-500 line-clamp-1">
                {recruiterName}
                {job.location && (
                  <>
                    <span className="mx-1 text-slate-300">
                      •
                    </span>
                    {job.location}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Badges fallback if there's no cover image */}
          {!job.cover_url && (
            <div className="flex flex-shrink-0 items-center gap-1.5 flex-wrap justify-end">
              {job.is_urgent && <Badge variant="urgent">Urgent</Badge>}
              <JobTypeBadge type={job.job_type} />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
          {job.description}
        </p>

        {/* Bottom Salary & CTA Row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border mt-auto">
          <div className="min-w-0">
            {job.salary_range ? (
              <p className="text-sm font-bold text-sky-600">
                {job.salary_range}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">Gaji dirahasiakan</p>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onApply?.(job.id)}
            isLoading={isApplying}
            disabled={isApplying}
            className="flex-shrink-0 h-9 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white"
          >
            {isApplying ? "Melamar..." : "Lamar Cepat"}
          </Button>
        </div>
      </div>

      {/* ── Hover glow accent (decorative) ── */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          "bg-gradient-to-br from-cyan-500/[0.03] to-transparent"
        )}
        aria-hidden="true"
      />
    </article>
  );
}

export { JobCard };
export type { JobCardProps };
