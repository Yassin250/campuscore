"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BookOpen } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
  DataTableSelectFilter,
  DataTableSorter,
  DataTableTextFilter,
} from "@/components/patterns/data-table";
import {
  DeleteButton,
  ShowButton,
} from "@/components/patterns/action-buttons";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { notify } from "@/components/notifications/toast-helpers";
import { departments, subjects } from "@/lib/mock";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/lib/constants";
import type { Subject } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SubjectsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // id → department name, used by the department column cell
  const departmentNameById = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    []
  );

  // Options for the department select filter (sorted alphabetically)
  const departmentFilterOptions = useMemo(
    () =>
      [...departments]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((d) => ({ label: d.name, value: String(d.id) })),
    []
  );

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Code</span>
            <DataTableSorter column={column} label="Code" />
            <DataTableTextFilter column={column} placeholder="Filter code..." />
          </div>
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono text-xs">
            {row.original.code}
          </Badge>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          return row.original.code
            .toLowerCase()
            .includes(String(value).toLowerCase());
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Name</span>
            <DataTableSorter column={column} label="Name" />
            <DataTableTextFilter column={column} placeholder="Filter name..." />
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.name}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          return row.original.name
            .toLowerCase()
            .includes(String(value).toLowerCase());
        },
      },
      {
        id: "department",
        // The value this column sorts/filters by — the department name
        accessorFn: (row) =>
          departmentNameById.get(row.departmentId) ?? "Unassigned",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Department</span>
            <DataTableSorter column={column} label="Department" />
            <DataTableSelectFilter
              column={column}
              options={departmentFilterOptions}
              placeholder="Any department"
            />
          </div>
        ),
        cell: ({ row }) => {
          const name = departmentNameById.get(row.original.departmentId);
          return name ? (
            <Badge variant="secondary">{name}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          
          
          return String(row.original.departmentId) === value;
        },
      },
      {
        accessorKey: "credits",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Credits</span>
            <DataTableSorter column={column} label="Credits" />
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.credits ?? "—"}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-sm text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <ShowButton href={ROUTES.SUBJECT(row.original.id)} />
            <DeleteButton
              itemName={row.original.name}
              onConfirm={async () => {
                // TODO: replace with a real mutation when the backend exists
                notify.success(
                  `${row.original.name} deleted`,
                  "This is a placeholder — nothing was actually removed."
                );
              }}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [departmentNameById, departmentFilterOptions]
  );

  const table = useReactTable({
    data: subjects,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: DEFAULT_PAGE_SIZE } },
  });

  return (
    <>
      <DataTable
        table={table}
        emptyState={
          <EmptyState
            variant="compact"
            icon={BookOpen}
            title="No subjects found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={subjects.length} />
    </>
  );
}

SubjectsTable.displayName = "SubjectsTable";