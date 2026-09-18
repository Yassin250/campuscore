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
import { GraduationCap } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
  DataTableSelectFilter,
  DataTableSorter,
  DataTableTextFilter,
} from "@/components/patterns/data-table";
import { ShowButton } from "@/components/patterns/action-buttons";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { UserInfo } from "@/components/layout/user-info";
import {
  courses,
  departments,
  users,
} from "@/lib/mock";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/lib/constants";
import { countBy } from "@/lib/utils";
import type { User } from "@/types";

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      Inactive
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FacultyTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Only lecturers
  const faculty = useMemo(
    () => users.filter((u) => u.role === "LECTURER"),
    []
  );

  // id → department name
  const departmentNameById = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    []
  );

  // Options for the department filter (sorted alphabetically)
  const departmentFilterOptions = useMemo(
    () =>
      [...departments]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((d) => ({ label: d.name, value: String(d.id) })),
    []
  );

  // lecturerId → number of courses taught
  const courseCountByLecturer = useMemo(
    () => countBy(courses, (c) => c.lecturerId),
    []
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Name</span>
            <DataTableSorter column={column} label="Name" />
            <DataTableTextFilter
              column={column}
              placeholder="Filter name..."
            />
          </div>
        ),
        cell: ({ row }) => (
          <UserInfo
            name={row.original.name}
            email={row.original.email}
            image={row.original.image}
            avatarClassName="h-8 w-8"
            size="sm"
          />
        ),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          const q = String(value).toLowerCase();
          return (
            row.original.name.toLowerCase().includes(q) ||
            row.original.email.toLowerCase().includes(q)
          );
        },
      },
      {
        id: "department",
        accessorFn: (row) =>
          row.departmentId
            ? departmentNameById.get(row.departmentId) ?? "—"
            : "—",
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
          const name = row.original.departmentId
            ? departmentNameById.get(row.original.departmentId)
            : null;
          return name ? (
            <Badge variant="secondary">{name}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
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
        id: "courses",
        accessorFn: (row) => courseCountByLecturer[row.id] ?? 0,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Courses</span>
            <DataTableSorter column={column} label="Courses" />
          </div>
        ),
        cell: ({ getValue }) => {
          const count = getValue<number>();
          return (
            <span className="text-sm tabular-nums text-muted-foreground">
              {count}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        id: "status",
        accessorFn: (row) => (row.active === false ? "inactive" : "active"),
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Status</span>
            <DataTableSorter column={column} label="Status" />
          </div>
        ),
        cell: ({ row }) => (
          <StatusBadge active={row.original.active !== false} />
        ),
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <ShowButton href={ROUTES.FACULTY_MEMBER(row.original.id)} />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [departmentNameById, departmentFilterOptions, courseCountByLecturer]
  );

  const table = useReactTable({
    data: faculty,
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
            icon={GraduationCap}
            title="No faculty found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={faculty.length} />
    </>
  );
}

FacultyTable.displayName = "FacultyTable";