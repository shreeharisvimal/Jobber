import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TreeViewItem {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeViewItem[];
  disabled?: boolean;
}

export interface TreeViewProps {
  items: TreeViewItem[];
  defaultExpanded?: string[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onToggle?: (id: string, expanded: boolean) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helper – flatten visible IDs for keyboard navigation              */
/* ------------------------------------------------------------------ */

function flattenVisibleIds(
  items: TreeViewItem[],
  expanded: Set<string>,
): string[] {
  const result: string[] = [];
  for (const item of items) {
    result.push(item.id);
    if (item.children?.length && expanded.has(item.id)) {
      result.push(...flattenVisibleIds(item.children, expanded));
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  TreeViewNode (internal recursive component)                       */
/* ------------------------------------------------------------------ */

interface TreeNodeProps {
  item: TreeViewItem;
  level: number;
  selectedId?: string;
  expanded: Set<string>;
  onSelect?: (id: string) => void;
  onToggle?: (id: string, expanded: boolean) => void;
  visibleIds: string[];
}

function TreeNode({
  item,
  level,
  selectedId,
  expanded,
  onSelect,
  onToggle,
  visibleIds,
}: TreeNodeProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded.has(item.id);
  const isSelected = selectedId === item.id;

  const handleToggle = useCallback(() => {
    onToggle?.(item.id, !isExpanded);
  }, [item.id, isExpanded, onToggle]);

  const handleSelect = useCallback(() => {
    if (!item.disabled) {
      onSelect?.(item.id);
    }
  }, [item.id, item.disabled, onSelect]);

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors",
          "hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
          isSelected && "bg-brand-50 text-brand-700 hover:bg-brand-50",
          item.disabled && "cursor-not-allowed opacity-50",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        tabIndex={0}
        onClick={handleSelect}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          const currentIdx = visibleIds.indexOf(item.id);

          switch (e.key) {
            case "ArrowRight": {
              e.preventDefault();
              if (hasChildren && !isExpanded) {
                onToggle?.(item.id, true);
              }
              break;
            }
            case "ArrowLeft": {
              e.preventDefault();
              if (hasChildren && isExpanded) {
                onToggle?.(item.id, false);
              } else if (currentIdx > 0) {
                const prevId = visibleIds[currentIdx - 1];
                document.getElementById(`tree-node-${prevId}`)?.focus();
              }
              break;
            }
            case "ArrowDown": {
              e.preventDefault();
              if (currentIdx < visibleIds.length - 1) {
                const nextId = visibleIds[currentIdx + 1];
                document.getElementById(`tree-node-${nextId}`)?.focus();
              }
              break;
            }
            case "ArrowUp": {
              e.preventDefault();
              if (currentIdx > 0) {
                const prevId = visibleIds[currentIdx - 1];
                document.getElementById(`tree-node-${prevId}`)?.focus();
              }
              break;
            }
            case "Enter":
            case " ": {
              e.preventDefault();
              handleSelect();
              break;
            }
          }
        }}
        id={`tree-node-${item.id}`}
      >
        {/* Expand / collapse chevron */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            tabIndex={-1}
            aria-hidden="true"
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-150",
                isExpanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <span className="w-[18px] shrink-0" aria-hidden="true" />
        )}

        {/* Icon */}
        {item.icon && (
          <span className="shrink-0 text-muted-foreground [&>svg]:size-4" aria-hidden="true">
            {item.icon}
          </span>
        )}

        {/* Label */}
        <span className="truncate">{item.label}</span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul role="group">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              expanded={expanded}
              onSelect={onSelect}
              onToggle={onToggle}
              visibleIds={visibleIds}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  TreeView                                                           */
/* ------------------------------------------------------------------ */

function TreeView({
  items,
  defaultExpanded = [],
  selectedId,
  onSelect,
  onToggle,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const handleToggle = useCallback(
    (id: string, nextExpanded: boolean) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (nextExpanded) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      onToggle?.(id, nextExpanded);
    },
    [onToggle],
  );

  const visibleIds = useMemo(
    () => flattenVisibleIds(items, expanded),
    [items, expanded],
  );

  return (
    <ul role="tree" className={cn("text-sm", className)}>
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          selectedId={selectedId}
          expanded={expanded}
          onSelect={onSelect}
          onToggle={handleToggle}
          visibleIds={visibleIds}
        />
      ))}
    </ul>
  );
}

export { TreeView };
