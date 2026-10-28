import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const thinkingVariants = cva(
  "inline-flex items-center gap-2 text-fg-secondary",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotSizes: Record<string, string> = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

export interface AIThinkingIndicatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof thinkingVariants> {
  text?: string;
  variant?: "dots" | "wave" | "pulse" | "gradient";
}

function DotsVariant({ dotSize }: { dotSize: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("rounded-full bg-brand-500 animate-dot-pulse", dotSize)}
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

function WaveVariant() {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-0.5 rounded-full bg-brand-500"
          style={{
            height: "12px",
            animation: `dot-pulse 1.4s ease-in-out ${i * 120}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

function PulseVariant() {
  return (
    <span className="relative flex items-center justify-center size-4" aria-hidden="true">
      <span
        className="absolute size-3 rounded-full bg-brand-400 opacity-40"
        style={{ animation: "ai-pulse-ring 1.5s ease-out infinite" }}
      />
      <span
        className="absolute size-3 rounded-full bg-brand-400 opacity-40"
        style={{ animation: "ai-pulse-ring 1.5s ease-out 0.5s infinite" }}
      />
      <span className="relative size-2 rounded-full bg-brand-500" />
    </span>
  );
}

function GradientVariant({ size }: { size: "sm" | "md" | "lg" }) {
  const widthClass = size === "sm" ? "w-16" : size === "lg" ? "w-28" : "w-20";
  const heightClass = size === "sm" ? "h-3" : size === "lg" ? "h-5" : "h-4";

  return (
    <span
      className={cn("animate-ai-gradient rounded-full", widthClass, heightClass)}
      style={{
        background: "linear-gradient(90deg, var(--color-brand-400), var(--color-brand-600), var(--color-brand-400))",
        backgroundSize: "200% 100%",
      }}
      aria-hidden="true"
    />
  );
}

function AIThinkingIndicator({
  className,
  text = "Thinking...",
  variant = "dots",
  size = "md",
  ...props
}: AIThinkingIndicatorProps) {
  const resolvedSize = size ?? "md";
  const dotSize = dotSizes[resolvedSize];

  return (
    <div
      className={cn(thinkingVariants({ size, className }))}
      role="status"
      aria-label={text}
      {...props}
    >
      {variant === "dots" && <DotsVariant dotSize={dotSize ?? ""} />}
      {variant === "wave" && <WaveVariant />}
      {variant === "pulse" && <PulseVariant />}
      {variant === "gradient" && <GradientVariant size={resolvedSize} />}
      <span className="text-fg-secondary">{text}</span>
    </div>
  );
}

export { AIThinkingIndicator, thinkingVariants };
