import { forwardRef, type InputHTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  min?: string;
  max?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, min, max, disabled, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min={min}
        max={max}
        disabled={disabled}
        className={cn("pr-3", className)}
        leftIcon={<Calendar className="size-4" />}
        {...props}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
