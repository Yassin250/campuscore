"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  /** Total row count when using server-side pagination */
  total?: number;
  /** Show only prev/next (useful on mobile) */
  variant?: "default" | "simple";
  className?: string;
};

export function DataTablePagination<TData>({
  table,
  total,
  variant = "default",
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const currentPage = pageIndex + 1;

  const goToPage = (page: number) => {
    table.setPageIndex(Math.max(0, Math.min(page - 1, pageCount - 1)));
  };

  if (variant === "simple") {
    return (
      <div className={cn("ml-auto flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentPage} / {pageCount || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-2 px-1",
        className
      )}
    >
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {typeof total === "number"
          ? `${total} row${total === 1 ? "" : "s"}`
          : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium">
            Page {currentPage} of {pageCount || 1}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => goToPage(1)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => goToPage(pageCount)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

DataTablePagination.displayName = "DataTablePagination";