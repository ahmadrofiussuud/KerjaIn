import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Badge variants:
 * - urgent:    Pulsating orange/red for urgent indicators
 * - daily:     Soft teal for daily jobs
 * - shift:     Soft blue for shift jobs
 * - full-time: Solid deep blue for full-time positions
 * - success:   Green for accepted status
 * - warning:   Amber for pending/review status
 * - error:     Red for rejected status
 * - default:   Neutral slate
 */

export type BadgeVariant =
  | "urgent"
  | "daily"
  | "shift"
  | "full-time"
  | "success"
  | "warning"
  | "error"
  | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: [
    "bg-red-50 text-red-700 border-red-200",
    "animate-urgent-pulse",
  ].join(" "),
  daily: [
    "bg-sky-50 text-sky-700 border-sky-200",
  ].join(" "),
  shift: [
    "bg-slate-100 text-slate-700 border-slate-300",
  ].join(" "),
  "full-time": [
    "bg-slate-800 text-white border-slate-700",
  ].join(" "),
  success: [
    "bg-green-50 text-green-700 border-green-200",
  ].join(" "),
  warning: [
    "bg-amber-50 text-amber-700 border-amber-200",
  ].join(" "),
  error: [
    "bg-red-50 text-red-700 border-red-200",
  ].join(" "),
  default: [
    "bg-slate-50 text-slate-600 border-slate-200",
  ].join(" "),
};

/** Maps job_type enum values to display labels */
const jobTypeLabels: Record<string, string> = {
  daily: "Harian",
  shift: "Shift",
  "full-time": "Full-Time",
};

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        // Base
        "inline-flex items-center gap-1",
        "rounded-full border px-2.5 py-0.5",
        "text-xs font-semibold leading-none tracking-wide",
        "transition-colors duration-200",
        // Urgent variant gets a pulsating dot
        variant === "urgent" && "pr-3",
        // Variant
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "urgent" && (
        <span className="relative mr-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-urgent-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-urgent-500" />
        </span>
      )}
      {children}
    </span>
  );
}

/**
 * Helper to render a badge from a job_type enum value.
 */
function JobTypeBadge({
  type,
  className,
}: {
  type: "daily" | "shift" | "full-time";
  className?: string;
}) {
  return (
    <Badge variant={type} className={className}>
      {jobTypeLabels[type] || type}
    </Badge>
  );
}

export { Badge, JobTypeBadge };
export type { BadgeProps };
