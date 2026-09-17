"use client";

import { flexRender, type Table as ReactTable } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  table: ReactTable<TData>;
  /** Show a loading overlay + skeleton rows */
  isLoading?: boolean;
  /** How many skeleton rows to show while loading (default 5) */
  skeletonRows?: number;
  /** Custom empty state. Falls back to a generic "No data" message. */
  emptyState?: React.ReactNode;
  /** Apply `table-layout: fixed` for stable column widths (default true) */
  fixedLayout?: boolean;
  className?: string;
};

export function DataTable<TData>({
  table,
  isLoading = false,
  skeletonRows = 5,
  emptyState,
  fixedLayout = true,
  className,
}: DataTableProps<TData>) {
  const columns = table.getAllColumns();
  const leafColumns = table.getAllLeafColumns();
  const rows = table.getRowModel().rows;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-md border">
        <Table
          style={
            fixedLayout ? { tableLayout: "fixed", width: "100%" } : undefined
          }
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="relative">
            {isLoading ? (
              <SkeletonRows
                rows={skeletonRows}
                columns={leafColumns.length}
              />
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <div className="truncate">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-64">
                  {emptyState ?? <DefaultEmptyState />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Internals                                                          */
/* ------------------------------------------------------------------ */

function SkeletonRows({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={`skeleton-${rowIdx}`} aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={`skeleton-${rowIdx}-${colIdx}`}>
              <div className="h-6 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
      <TableRow>
        <TableCell
          colSpan={columns}
          className="pointer-events-none absolute inset-0"
        >
          <Loader2 className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-spin text-primary" />
        </TableCell>
      </TableRow>
    </>
  );
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-semibold text-foreground">No data</p>
      <p className="text-xs text-muted-foreground">
        Nothing to display here yet.
      </p>
    </div>
  );
}

DataTable.displayName = "DataTable";