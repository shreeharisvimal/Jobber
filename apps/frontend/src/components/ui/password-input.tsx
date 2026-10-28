import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
        rightIcon={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            className={cn(
              "pointer-events-auto text-neutral-400 transition-colors hover:text-neutral-600",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
