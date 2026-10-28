import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { RefreshCw, Copy, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIBadge } from "@/components/ai/AIBadge";

type ContentStatus = "generating" | "complete" | "error";
type ContentVariant = "block" | "inline" | "card";

const variantStyles: Record<ContentVariant, string> = {
  block: "border-l-2 border-l-brand-300 bg-brand-50/30 rounded-r-lg",
  inline: "bg-brand-50/40 rounded-md",
  card: "border border-border bg-card rounded-xl shadow-sm",
};

function CopyButton({ onCopy }: { onCopy?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors duration-normal hover:bg-neutral-100 hover:text-fg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={copied ? "Copied" : "Copy content"}
    >
      {copied ? (
        <Check className="size-3.5 text-success-500" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export interface GeneratedContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  status?: ContentStatus;
  variant?: ContentVariant;
  onRegenerate?: () => void;
  onCopy?: () => void;
}

function GeneratedContent({
  className,
  children,
  status = "complete",
  variant = "block",
  onRegenerate,
  onCopy,
  ...props
}: GeneratedContentProps) {
  return (
    <div
      className={cn(
        "relative transition-all duration-normal",
        variantStyles[variant],
        status === "generating" && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {status === "generating" && (
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      )}

      <div className={cn(
        "relative",
        variant === "card" ? "p-5" : variant === "block" ? "p-4" : "px-3 py-2",
        status === "generating" && "opacity-60",
      )}>
        {status === "error" ? (
          <div className="flex items-center gap-3 text-sm text-danger-600">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">Something went wrong while generating content.</span>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-danger-700 transition-colors duration-normal hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <RefreshCw className="size-3" aria-hidden="true" />
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            {children}
            {status === "complete" && (
              <div className="mt-3 flex items-center gap-2 border-t border-brand-100 pt-3">
                <AIBadge variant="generated" size="sm" />
                <div className="flex-1" />
                <CopyButton onCopy={onCopy} />
                {onRegenerate && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors duration-normal hover:bg-neutral-100 hover:text-fg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-label="Regenerate content"
                  >
                    <RefreshCw className="size-3.5" aria-hidden="true" />
                    Regenerate
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { GeneratedContent };
