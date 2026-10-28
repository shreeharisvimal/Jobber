import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-fast select-none",
  {
    variants: {
      variant: {
        filled:
          "bg-neutral-100 text-neutral-700",
        outlined:
          "border border-neutral-200 text-neutral-700 bg-transparent",
        soft:
          "bg-neutral-100/60 text-neutral-600",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
    },
  },
);

const selectedColorMap: Record<string, string> = {
  filled: "bg-brand-50 text-brand-700",
  outlined: "border-brand-300 text-brand-700 bg-brand-50",
  soft: "bg-brand-100/60 text-brand-700",
};

export interface ChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
  leadingIcon?: ReactNode;
}

function Chip({
  className,
  variant,
  size,
  selected = false,
  leadingIcon,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        chipVariants({ variant, size, className }),
        selected && (selectedColorMap[variant ?? "filled"] || selectedColorMap.filled),
      )}
      aria-pressed={selected}
      {...props}
    >
      {selected ? (
        <Check
          className={cn("shrink-0", size === "sm" ? "size-3" : "size-3.5")}
          aria-hidden="true"
        />
      ) : (
        leadingIcon && (
          <span className="shrink-0 [&>svg]:size-3.5" aria-hidden="true">
            {leadingIcon}
          </span>
        )
      )}
      {children}
    </button>
  );
}

export { Chip, chipVariants };
