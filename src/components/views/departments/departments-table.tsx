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
import { Building2 } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
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
import { countBy } from "@/lib/utils";
import type { Department } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DepartmentsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Count subjects per department once
  const subjectCountByDepartment = useMemo(
    () => countBy(subjects, (s) => s.departmentId),
    []
  );

  const columns = useMemo<ColumnDef<Department>[]>(
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
        id: "subjects",
        accessorFn: (row) => subjectCountByDepartment[row.id] ?? 0,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Subjects</span>
            <DataTableSorter column={column} label="Subjects" />
          </div>
        ),
        cell: ({ getValue }) => {
          const count = getValue<number>();
          return (
            <Badge variant="secondary">
              {count} {count === 1 ? "subject" : "subjects"}
            </Badge>
          );
        },
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
            <ShowButton href={ROUTES.DEPARTMENT(row.original.id)} />
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
    [subjectCountByDepartment]
  );

  const table = useReactTable({
    data: departments,
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
            icon={Building2}
            title="No departments found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={departments.length} />
    </>
  );
}

DepartmentsTable.displayName = "DepartmentsTable";