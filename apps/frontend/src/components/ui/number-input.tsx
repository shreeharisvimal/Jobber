import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

function NumberInput({
  value: controlledValue,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled,
  className,
}: NumberInputProps) {
  const [internalValue, setInternalValue] = useState(0);
  const currentValue = controlledValue ?? internalValue;

  const clamp = (v: number) => Math.min(Math.max(v, min), max);

  const updateValue = (newValue: number) => {
    const clamped = clamp(newValue);
    if (controlledValue === undefined) {
      setInternalValue(clamped);
    }
    onChange?.(clamped);
  };

  const handleDecrement = () => {
    if (!disabled) {
      updateValue(currentValue - step);
    }
  };

  const handleIncrement = () => {
    if (!disabled) {
      updateValue(currentValue + step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      return;
    }
    const parsed = Number(raw);
    if (!isNaN(parsed)) {
      updateValue(parsed);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center",
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || currentValue <= min}
        className={cn(
          "flex size-9 items-center justify-center rounded-l-md border border-r-0 border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors",
          "hover:bg-neutral-100 active:bg-neutral-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="Decrement"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={currentValue}
        onChange={handleInputChange}
        disabled={disabled}
        className={cn(
          "h-9 w-16 border border-neutral-200 bg-white px-2 text-center text-sm text-neutral-900",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || currentValue >= max}
        className={cn(
          "flex size-9 items-center justify-center rounded-r-md border border-l-0 border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors",
          "hover:bg-neutral-100 active:bg-neutral-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="Increment"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export { NumberInput };
