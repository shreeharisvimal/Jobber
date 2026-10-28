import { forwardRef, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, disabled, placeholder = "Search...", ...props }, ref) => {
    const handleClear = () => {
      onClear?.();
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const hasValue = value !== undefined && value !== "" && String(value).length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn("pr-9", className)}
        leftIcon={<Search className="size-4" />}
        rightIcon={
          hasValue ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              disabled={disabled}
              className={cn(
                "pointer-events-auto text-neutral-400 transition-colors hover:text-neutral-600",
                "focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
