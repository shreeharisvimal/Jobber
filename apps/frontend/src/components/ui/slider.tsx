import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  showMinMax?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      size = "md",
      disabled,
      showValue = false,
      showMinMax = false,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? min);
    const currentValue = value ?? internalValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const heightClass = {
      sm: "h-1",
      md: "h-1.5",
      lg: "h-2",
    }[size];

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {(showValue || showMinMax) && (
          <div className="flex items-center justify-between">
            {showMinMax && (
              <span className="text-xs text-neutral-500">{min}</span>
            )}
            {showValue && (
              <span className="text-sm font-medium text-neutral-700">
                {currentValue}
              </span>
            )}
            {showMinMax && (
              <span className="text-xs text-neutral-500">{max}</span>
            )}
          </div>
        )}
        <div className="relative flex w-full items-center">
          <div
            className={cn(
              "absolute w-full rounded-full bg-neutral-200",
              heightClass,
            )}
          />
          <div
            className={cn("absolute rounded-full bg-brand-600", heightClass)}
            style={{ width: `${percentage}%` }}
          />
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              "relative w-full cursor-pointer appearance-none bg-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-neutral-300 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-fast",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-neutral-300",
              size === "sm" && "[&::-webkit-slider-thumb]:size-3 [&::-moz-range-thumb]:size-3",
              size === "lg" && "[&::-webkit-slider-thumb]:size-5 [&::-moz-range-thumb]:size-5",
            )}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider";

export { Slider };
