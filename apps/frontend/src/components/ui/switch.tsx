import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const trackSizes = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-14",
} as const;

const thumbSizes = {
  sm: "size-3.5",
  md: "size-4.5",
  lg: "size-5.5",
} as const;

const thumbTranslations = {
  sm: "translate-x-[1px] group-checked:translate-x-[18px]",
  md: "translate-x-[1px] group-checked:translate-x-[22px]",
  lg: "translate-x-[1px] group-checked:translate-x-[28px]",
} as const;

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  name?: string;
}

function Switch({
  checked = false,
  onChange,
  label,
  disabled,
  size = "md",
  className,
  name,
}: SwitchProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <label
      className={cn(
        "group inline-flex items-center gap-2",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        checked && "group-checked:",
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        name={name}
        tabIndex={0}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        data-checked={checked ? "" : undefined}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500",
          trackSizes[size],
          checked ? "bg-brand-600" : "bg-neutral-300",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-xs transition-transform duration-fast",
            thumbSizes[size],
            thumbTranslations[size],
          )}
          style={{
            transform: checked
              ? `translateX(${size === "sm" ? "18px" : size === "md" ? "22px" : "28px"})`
              : "translateX(1px)",
          }}
        />
      </button>
      {label && (
        <span className="text-sm text-neutral-700 select-none">{label}</span>
      )}
    </label>
  );
}

export { Switch };
