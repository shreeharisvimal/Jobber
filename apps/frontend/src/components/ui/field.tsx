import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

function Field({
  label,
  hint,
  error,
  success,
  required,
  disabled,
  children,
  className,
  htmlFor,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required} disabled={disabled}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}
      {success && !error && (
        <p className="text-xs text-success-600">{success}</p>
      )}
      {hint && !error && !success && (
        <p className="text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

export { Field };
