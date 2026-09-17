"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTableSorterProps<TData> = {
  column: Column<TData>;
  /** Human-readable column name for the aria-label */
  label?: string;
  className?: string;
};

export function DataTableSorter<TData>({
  column,
  label,
  className,
}: DataTableSorterProps<TData>) {
  if (!column.getCanSort()) return null;

  const sorted = column.getIsSorted();
  const columnName = label ?? column.id;

  const title =
    sorted === "desc"
      ? `Sort ${columnName} descending`
      : sorted === "asc"
        ? `Sort ${columnName} ascending`
        : `Sort ${columnName}`;

  const Icon =
    sorted === "desc"
      ? ArrowDown
      : sorted === "asc"
        ? ArrowUp
        : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => column.toggleSorting(undefined, true)}
      title={title}
      aria-label={title}
      className={cn(
        "h-6 w-6 shrink-0",
        sorted ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
}

DataTableSorter.displayName = "DataTableSorter";