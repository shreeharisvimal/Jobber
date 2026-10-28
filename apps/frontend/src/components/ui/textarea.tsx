import { type VariantProps, cva } from "class-variance-authority";
import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      textareaSize: {
        sm: "px-3 py-2 text-xs",
        md: "px-3 py-2.5 text-sm",
        lg: "px-4 py-3 text-sm",
      },
      variant: {
        default:
          "border-neutral-200 focus-visible:ring-brand-500",
        error:
          "border-danger-300 text-danger-900 placeholder:text-danger-400 focus-visible:ring-danger-500",
        success:
          "border-success-300 text-success-900 placeholder:text-success-400 focus-visible:ring-success-500",
      },
    },
    defaultVariants: {
      textareaSize: "md",
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      textareaSize,
      variant,
      autoResize = false,
      onChange,
      value,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement,
      [],
    );

    const hasError = variant === "error" || ariaInvalid === true;

    useEffect(() => {
      if (autoResize && innerRef.current) {
        innerRef.current.style.height = "auto";
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
      }
    }, [autoResize, value]);

    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      if (autoResize) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <textarea
        className={cn(
          textareaVariants({
            textareaSize,
            variant: hasError ? "error" : variant,
            className,
          }),
        )}
        ref={innerRef}
        onChange={handleChange}
        value={value}
        aria-invalid={hasError || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
