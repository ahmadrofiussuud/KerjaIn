import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = "text", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-deep-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            // Base layout
            "h-11 w-full rounded-lg px-4",
            "text-sm text-deep-900 placeholder:text-slate-400",
            // Border
            "border border-slate-300",
            // Background
            "bg-white",
            // Focus — Electric Cyan ring
            "focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500",
            "focus:shadow-glow-cyan-sm",
            // Transition
            "transition-all duration-200 ease-out",
            // Disabled
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            // Error state
            error &&
              "border-error-500 focus:ring-error-500/40 focus:border-error-500 focus:shadow-none",
            // Dark mode
            "dark:bg-deep-800 dark:border-deep-400 dark:text-slate-100",
            "dark:placeholder:text-slate-500",
            "dark:focus:border-cyan-500 dark:focus:ring-cyan-500/30",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-error-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
