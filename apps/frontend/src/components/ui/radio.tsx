import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const dotSizes = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
} as const;

export interface RadioProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  name?: string;
  className?: string;
  value?: string;
}

function Radio({
  checked = false,
  onChange,
  label,
  disabled,
  size = "md",
  name,
  className,
  value,
}: RadioProps) {
  const group = useContext(RadioGroupContext);

  const effectiveName = group?.name ?? name;
  const effectiveChecked = group ? group.value === value : checked;

  const handleChange = () => {
    if (!disabled) {
      if (group && value) {
        group.onChange?.(value);
      } else {
        onChange?.(!effectiveChecked);
      }
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
        role="radio"
        aria-checked={effectiveChecked}
        aria-disabled={disabled}
        disabled={disabled}
        name={effectiveName}
        value={value}
        tabIndex={0}
        onClick={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500",
          effectiveChecked
            ? "border-brand-600 bg-white"
            : "border-neutral-300 bg-white",
          !disabled && !effectiveChecked && "hover:border-brand-400",
        )}
      >
        <span
          className={cn(
            "rounded-full transition-transform duration-fast",
            dotSizes[size],
            effectiveChecked ? "scale-100 bg-brand-600" : "scale-0 bg-transparent",
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-neutral-700 select-none">{label}</span>
      )}
    </label>
  );
}

interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

function RadioGroup({
  children,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div
        role="radiogroup"
        className={cn("flex flex-col gap-2", className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export { Radio, RadioGroup };
