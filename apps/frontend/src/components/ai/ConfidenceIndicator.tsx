import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ConfidenceSize = "sm" | "md" | "lg";
type ConfidenceVariant = "bar" | "circle" | "text";

function getConfidenceColor(value: number): { ring: string; text: string; fill: string; label: string } {
  if (value >= 70) {
    return {
      ring: "stroke-success-500",
      text: "text-success-600",
      fill: "bg-success-500",
      label: value >= 90 ? "Very High" : "High",
    };
  }
  if (value >= 40) {
    return {
      ring: "stroke-warning-500",
      text: "text-warning-600",
      fill: "bg-warning-500",
      label: "Medium",
    };
  }
  return {
    ring: "stroke-danger-500",
    text: "text-danger-600",
    fill: "bg-danger-500",
    label: "Low",
  };
}

const circleSizes: Record<ConfidenceSize, { container: string; svg: string; text: string }> = {
  sm: { container: "size-10", svg: "size-10", text: "text-[10px]" },
  md: { container: "size-14", svg: "size-14", text: "text-xs" },
  lg: { container: "size-20", svg: "size-20", text: "text-sm" },
};

const barSizes: Record<ConfidenceSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const textSizeMap: Record<ConfidenceSize, string> = {
  sm: "text-sm font-medium",
  md: "text-lg font-semibold",
  lg: "text-2xl font-bold",
};

export interface ConfidenceIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: ConfidenceSize;
  showLabel?: boolean;
  variant?: ConfidenceVariant;
}

function BarIndicator({ value, size, showLabel, className }: { value: number; size: ConfidenceSize; showLabel: boolean; className?: string }) {
  const colors = getConfidenceColor(value);
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn("text-xs font-medium", colors.text)}>{colors.label}</span>
          <span className="text-xs font-medium text-fg-secondary tabular-nums">{clampedValue}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-neutral-100", barSizes[size])}>
        <div
          className={cn("h-full rounded-full transition-[width] duration-slow ease-in-out", colors.fill)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

function CircleIndicator({ value, size, showLabel, className }: { value: number; size: ConfidenceSize; showLabel: boolean; className?: string }) {
  const colors = getConfidenceColor(value);
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const sizeConfig = circleSizes[size];
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div className={cn("relative flex items-center justify-center", sizeConfig.container)}>
        <svg
          className={cn("rotate-[-90deg]", sizeConfig.svg)}
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-neutral-100"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={cn("transition-[stroke-dashoffset] duration-slow ease-in-out", colors.ring)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={cn("absolute font-semibold tabular-nums", sizeConfig.text, colors.text)}>
          {clampedValue}
        </span>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", colors.text)}>{colors.label}</span>
      )}
    </div>
  );
}

function TextIndicator({ value, size, showLabel, className }: { value: number; size: ConfidenceSize; showLabel: boolean; className?: string }) {
  const colors = getConfidenceColor(value);
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className={cn("tabular-nums", textSizeMap[size], colors.text)}>
        {clampedValue}%
      </span>
      {showLabel && (
        <span className={cn("text-xs font-medium", colors.text)}>{colors.label}</span>
      )}
    </div>
  );
}

const variantComponents: Record<ConfidenceVariant, typeof BarIndicator> = {
  bar: BarIndicator,
  circle: CircleIndicator,
  text: TextIndicator,
};

function ConfidenceIndicator({
  className,
  value,
  size = "md",
  showLabel = true,
  variant = "bar",
  ...props
}: ConfidenceIndicatorProps) {
  const Component = variantComponents[variant];

  return (
    <div className={cn("w-full", className)} {...props}>
      <Component value={value} size={size} showLabel={showLabel} />
    </div>
  );
}

export { ConfidenceIndicator };
