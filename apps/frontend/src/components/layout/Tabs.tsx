import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface TabsCtx {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsCtx>({
  value: "",
  onValueChange: () => {},
});

function useTabsContext() {
  return useContext(TabsContext);
}

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

function Tabs({
  value: controlledValue,
  onValueChange,
  defaultValue = "",
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo<TabsCtx>(
    () => ({ value: currentValue, onValueChange: handleValueChange }),
    [currentValue, handleValueChange],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  TabsList                                                           */
/* ------------------------------------------------------------------ */

type TabsListVariant = "underline" | "pills" | "enclosed";
type TabsListSize = "sm" | "md" | "lg";

interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: TabsListVariant;
  size?: TabsListSize;
}

const variantClasses: Record<TabsListVariant, string> = {
  underline:
    "border-b border-border bg-transparent p-0 gap-0",
  pills:
    "rounded-lg bg-muted p-1 gap-1",
  enclosed:
    "rounded-lg border border-border bg-muted/40 p-1 gap-0",
};

const sizeClasses: Record<TabsListSize, string> = {
  sm: "h-8 text-xs gap-1",
  md: "h-10 text-sm gap-1.5",
  lg: "h-11 text-sm gap-2",
};

function TabsList({
  children,
  className,
  variant = "underline",
  size = "md",
}: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TabsTrigger                                                        */
/* ------------------------------------------------------------------ */

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
  className?: string;
}

function TabsTrigger({
  value,
  children,
  icon,
  count,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;

  const handleClick = useCallback(() => {
    if (!disabled) {
      ctx.onValueChange(value);
    }
  }, [disabled, ctx, value]);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        !isActive &&
          "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        isActive &&
          "bg-background text-foreground shadow-sm",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:size-4" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {count != null && (
        <span
          className={cn(
            "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
            isActive
              ? "bg-brand-100 text-brand-700"
              : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  TabsContent                                                        */
/* ------------------------------------------------------------------ */

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const ctx = useTabsContext();

  if (ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn(
        "mt-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
};
