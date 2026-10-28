import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  TableCaption                                                       */
/* ------------------------------------------------------------------ */

function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Table (root wrapper + horizontal scroll)                          */
/* ------------------------------------------------------------------ */

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  sticky?: boolean;
}

function Table({
  className,
  bordered = false,
  sticky = false,
  children,
  ...props
}: TableProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-auto rounded-lg scrollbar-thin",
        className,
      )}
      {...props}
    >
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          bordered && "border border-border",
          sticky && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10",
        )}
      >
        {children}
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TableHeader                                                        */
/* ------------------------------------------------------------------ */

function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-border bg-muted/50", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TableBody                                                          */
/* ------------------------------------------------------------------ */

function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TableRow                                                           */
/* ------------------------------------------------------------------ */

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  striped?: boolean;
  hoverable?: boolean;
}

function TableRow({
  className,
  striped = false,
  hoverable = true,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors",
        hoverable && "hover:bg-muted/50",
        striped && "even:bg-muted/30",
        "data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TableHead                                                          */
/* ------------------------------------------------------------------ */

function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TableCell                                                          */
/* ------------------------------------------------------------------ */

function TableCell({
  className,
  ...props
}: HTMLTableCellElement extends infer T
  ? T extends HTMLTableCellElement
    ? HTMLAttributes<T>
    : never
  : HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  EmptyTable                                                         */
/* ------------------------------------------------------------------ */

export interface EmptyTableProps {
  colSpan: number;
  children?: ReactNode;
  className?: string;
}

function EmptyTable({ colSpan, children, className }: EmptyTableProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(
          "h-48 text-center text-muted-foreground",
          className,
        )}
      >
        {children ?? "No results."}
      </td>
    </tr>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableRow,
  TableHead,
  TableCell,
  EmptyTable,
};
