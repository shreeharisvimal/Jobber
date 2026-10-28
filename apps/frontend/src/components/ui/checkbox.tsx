import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const iconSizes = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
} as const;

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  name?: string;
}

function Checkbox({
  checked = false,
  onChange,
  label,
  disabled,
  size = "md",
  className,
  name,
}: CheckboxProps) {
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
        "inline-flex items-center gap-2",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        name={name}
        tabIndex={0}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex shrink-0 items-center justify-center rounded border transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500",
          checked
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-neutral-300 bg-white text-transparent",
          !disabled && !checked && "hover:border-brand-400",
        )}
      >
        <svg
          className={iconSizes[size]}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {label && (
        <span className="text-sm text-neutral-700 select-none">{label}</span>
      )}
      {name && <input type="hidden" name={name} value={checked ? "true" : "false"} />}
    </label>
  );
}

export { Checkbox };
