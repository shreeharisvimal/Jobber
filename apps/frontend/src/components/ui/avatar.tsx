import { type VariantProps, cva } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ImgHTMLAttributes,
} from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-neutral-100",
  {
    variants: {
      variant: {
        circle: "rounded-full",
        square: "rounded-lg",
        rounded: "rounded-xl",
      },
      size: {
        xs: "size-6 text-xs",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-14 text-lg",
        "2xl": "size-16 text-xl",
      },
    },
    defaultVariants: {
      variant: "circle",
      size: "md",
    },
  },
);

const statusSizeMap: Record<string, string> = {
  xs: "size-1.5 border",
  sm: "size-2 border-[1.5px]",
  md: "size-2.5 border-2",
  lg: "size-3 border-2",
  xl: "size-3.5 border-2",
  "2xl": "size-4 border-2",
};

const statusColorMap: Record<string, string> = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  away: "bg-warning-500",
  busy: "bg-danger-500",
};

type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size">,
    VariantProps<typeof avatarVariants> {
  fallback?: string;
  status?: AvatarStatus;
  src?: string;
  alt?: string;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      variant,
      size,
      fallback,
      status,
      src,
      alt = "",
      onError,
      ...props
    },
    ref,
  ) => {
    const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">(
      src ? "loading" : "error",
    );

    useEffect(() => {
      if (src) {
        setImgStatus("loading");
      } else {
        setImgStatus("error");
      }
    }, [src]);

    const handleLoad = useCallback(() => {
      setImgStatus("loaded");
    }, []);

    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImgStatus("error");
        onError?.(e);
      },
      [onError],
    );

    const initials = fallback
      ? fallback
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : null;

    const showImage = imgStatus === "loaded";

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ variant, size, className }))}
        role="img"
        aria-label={alt || fallback || "Avatar"}
      >
        {src && imgStatus !== "error" && (
          <img
            src={src}
            alt={alt}
            className={cn(
              "size-full object-cover",
              showImage ? "block" : "hidden",
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
        {!showImage && (
          <span className="flex items-center justify-center text-neutral-500">
            {initials ? (
              <span className="font-medium leading-none">{initials}</span>
            ) : (
              <User
                className={cn(
                  size === "xs" && "size-3",
                  size === "sm" && "size-3.5",
                  size === "md" && "size-4",
                  size === "lg" && "size-5",
                  size === "xl" && "size-6",
                  size === "2xl" && "size-7",
                )}
              />
            )}
          </span>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-background",
              statusSizeMap[size ?? "md"],
              statusColorMap[status],
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
