import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Button variants:
 * - primary:   Electric Cyan bg with subtle glow on hover
 * - secondary: Transparent with deep blue border
 * - ghost:     Transparent, subtle hover background
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-cyan-600 text-white font-semibold shadow-md",
    "hover:bg-cyan-500 hover:shadow-glow-cyan",
    "active:bg-cyan-700 active:scale-98",
    "disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none",
    "dark:bg-cyan-500 dark:text-slate-950",
    "dark:hover:bg-cyan-400",
  ].join(" "),
  secondary: [
    "bg-slate-800/50 text-slate-100 font-semibold border border-slate-700",
    "hover:bg-slate-800 hover:border-cyan-500/50 hover:shadow-glow-cyan-sm",
    "active:bg-slate-900 active:scale-98",
    "disabled:border-slate-800 disabled:text-slate-600",
    "light:bg-slate-100 light:text-slate-800 light:border-slate-300",
    "light:hover:bg-slate-200",
  ].join(" "),
  ghost: [
    "bg-transparent text-slate-400 font-medium",
    "hover:bg-slate-800/60 hover:text-slate-100",
    "active:bg-slate-800",
    "disabled:text-slate-700",
    "light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-5 text-sm rounded-lg gap-2",
  lg: "h-12 px-7 text-base rounded-xl gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          "inline-flex items-center justify-center whitespace-nowrap",
          "transition-all duration-200 ease-out",
          "cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
          "disabled:cursor-not-allowed disabled:opacity-60",
          // Variant + Size
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
