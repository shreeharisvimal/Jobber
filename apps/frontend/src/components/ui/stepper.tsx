import type { HTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StepperStep {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  currentStep: number;
  variant?: "default" | "brand" | "success";
  orientation?: "horizontal" | "vertical";
}

/* ------------------------------------------------------------------ */
/*  Variant → colour mapping                                          */
/* ------------------------------------------------------------------ */

const activeRingMap: Record<string, string> = {
  default: "ring-brand-500 bg-brand-50 text-brand-700",
  brand: "ring-brand-500 bg-brand-50 text-brand-700",
  success: "ring-success-500 bg-success-50 text-success-700",
};

const completedBgMap: Record<string, string> = {
  default: "bg-brand-600 text-white",
  brand: "bg-brand-600 text-white",
  success: "bg-success-600 text-white",
};

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({
  steps,
  currentStep,
  variant = "brand",
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        isVertical ? "flex flex-col" : "flex items-start",
        className,
      )}
      role="navigation"
      aria-label="Steps"
      {...props}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isFuture = idx > currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <div
            key={idx}
            className={cn(
              isVertical
                ? "flex gap-4 pb-8 last:pb-0"
                : "flex flex-1 items-start gap-3",
            )}
          >
            {/* Step indicator */}
            <div className="relative flex shrink-0 flex-col items-center">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && completedBgMap[variant],
                  isActive && cn("ring-2 ring-offset-2", activeRingMap[variant]),
                  isFuture && "bg-neutral-100 text-neutral-400",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : step.icon ?? (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Connector line (horizontal) */}
              {!isVertical && !isLast && (
                <div
                  className={cn(
                    "absolute top-4 left-full h-px w-full",
                    isCompleted ? "bg-brand-500" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Connector line (vertical) */}
              {isVertical && !isLast && (
                <div
                  className={cn(
                    "absolute top-8 left-4 bottom-0 w-px -translate-x-1/2",
                    isCompleted ? "bg-brand-500" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step content */}
            <div
              className={cn(
                isVertical ? "flex-1" : "min-w-0 flex-1",
                !isVertical && "pt-0.5",
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-foreground",
                  isActive && "text-foreground",
                  isFuture && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Stepper };
