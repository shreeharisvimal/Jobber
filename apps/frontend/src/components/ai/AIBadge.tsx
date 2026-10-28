import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { Sparkles, Brain, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const aiBadgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors duration-normal",
  {
    variants: {
      variant: {
        generated:
          "bg-brand-100 text-brand-800 shadow-xs shadow-brand-200/50",
        assisted:
          "bg-brand-50 text-brand-700",
        analyzed:
          "bg-neutral-100 text-neutral-700",
        recommended:
          "bg-success-50 text-success-700",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "generated",
      size: "md",
    },
  },
);

const variantIcons = {
  generated: Sparkles,
  assisted: Brain,
  analyzed: Search,
  recommended: Star,
};

const variantLabels = {
  generated: "AI Generated",
  assisted: "AI Assisted",
  analyzed: "AI Analyzed",
  recommended: "AI Recommended",
};

export interface AIBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof aiBadgeVariants> {
  animate?: boolean;
}

function AIBadge({
  className,
  variant = "generated",
  size,
  animate = false,
  ...props
}: AIBadgeProps) {
  const Icon = variantIcons[variant ?? "generated"];

  return (
    <span
      className={cn(
        aiBadgeVariants({ variant, size, className }),
        animate && "animate-pulse",
      )}
      {...props}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {variantLabels[variant ?? "generated"]}
    </span>
  );
}

export { AIBadge, aiBadgeVariants };
