import { cn } from "@/lib/utils";

interface IconProps {
  name: string;           // Material Symbol name, e.g. "home", "work", "bolt"
  className?: string;
  size?: number;          // font-size in px, default 20
  fill?: boolean;         // filled variant
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

/**
 * Material Symbols Outlined icon component.
 * Requires the Material Symbols stylesheet loaded in layout.tsx.
 *
 * Icon names: https://fonts.google.com/icons
 */
export function Icon({ name, className, size = 20, fill = false, weight = 400 }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
