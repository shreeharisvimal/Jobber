import { useRef, useState, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  className,
}: OtpInputProps) {
  const [internalValues, setInternalValues] = useState<string[]>(
    () => Array(length).fill(""),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const values = value
    ? value.split("").concat(Array(length).fill("")).slice(0, length)
    : internalValues;

  const updateValues = useCallback(
    (newValues: string[]) => {
      if (value === undefined) {
        setInternalValues(newValues);
      }
      onChange?.(newValues.join(""));
    },
    [value, onChange],
  );

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleInput = (index: number, inputValue: string) => {
    if (disabled) return;

    const digit = inputValue.replace(/[^0-9]/g, "").slice(-1);
    const newValues = [...values];
    newValues[index] = digit;
    updateValues(newValues);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...values];
      if (values[index]) {
        newValues[index] = "";
        updateValues(newValues);
      } else if (index > 0) {
        newValues[index - 1] = "";
        updateValues(newValues);
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    const newValues = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    updateValues(newValues);

    const focusIndex = Math.min(pasted.length, length - 1);
    focusInput(focusIndex);
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="group"
      aria-label="One-time password input"
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          disabled={disabled}
          value={values[i] ?? ""}
          onInput={(e) => handleInput(i, e.currentTarget.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "size-10 rounded-md border border-neutral-200 bg-white text-center text-sm font-medium text-neutral-900",
            "transition-colors duration-fast",
            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  );
}

export { OtpInput };
