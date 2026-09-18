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
import { BookOpen, ImageIcon, Users } from "lucide-react";

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
import { UserAvatar } from "@/components/layout/user-avatar";
import {
  classes,
  courses,
  enrollments,
  users,
} from "@/lib/mock";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/lib/constants";
import { countBy } from "@/lib/utils";
import { formatJoinCode } from "@/lib/joinCode";
import type { ClassDetails } from "@/types";

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: ClassDetails["status"] }) {
  const styles: Record<ClassDetails["status"], string> = {
    active:
      "text-emerald-700 dark:text-emerald-400 before:bg-emerald-500",
    inactive:
      "text-muted-foreground before:bg-muted-foreground",
    archived:
      "text-amber-700 dark:text-amber-400 before:bg-amber-500",
  };

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 pl-3 text-xs font-medium capitalize ${styles[status]}`}
    >
      <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ClassesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Lookups
  const courseById = useMemo(
    () => new Map(courses.map((c) => [c.id, c])),
    []
  );
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), []);

  // Options for course select filter
  const courseFilterOptions = useMemo(
    () =>
      [...courses]
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((c) => ({
          label: `${c.code} — ${c.name}`,
          value: String(c.id),
        })),
    []
  );

  // Options for lecturer select filter
  const lecturerFilterOptions = useMemo(
    () =>
      users
        .filter((u) => u.role === "LECTURER")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => ({ label: u.name, value: u.id })),
    []
  );

  // Enrolled count per class
  const enrolledCountByClass = useMemo(
    () =>
      countBy(
        enrollments.filter((e) => e.status === "active"),
        (e) => e.classId
      ),
    []
  );

  const columns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Class</span>
            <DataTableSorter column={column} label="Class" />
            <DataTableTextFilter
              column={column}
              placeholder="Filter by name..."
            />
          </div>
        ),
        cell: ({ row }) => {
          const cls = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                {cls.bannerUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cls.bannerUrl}
                    alt={cls.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{cls.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatJoinCode(cls.joinCode)}
                </p>
              </div>
            </div>
          );
        },
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
        id: "course",
        accessorFn: (row) => courseById.get(row.courseId)?.name ?? "—",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Course</span>
            <DataTableSorter column={column} label="Course" />
            <DataTableSelectFilter
              column={column}
              options={courseFilterOptions}
              placeholder="Any course"
            />
          </div>
        ),
        cell: ({ row }) => {
          const course = courseById.get(row.original.courseId);
          return course ? (
            <Badge variant="outline" className="font-mono text-xs">
              {course.code}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          return String(row.original.courseId) === value;
        },
      },
      {
        id: "lecturer",
        accessorFn: (row) => userById.get(row.lecturerId)?.name ?? "Unassigned",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Lecturer</span>
            <DataTableSorter column={column} label="Lecturer" />
            <DataTableSelectFilter
              column={column}
              options={lecturerFilterOptions}
              placeholder="Any lecturer"
            />
          </div>
        ),
        cell: ({ row }) => {
          const lecturer = userById.get(row.original.lecturerId);
          if (!lecturer) {
            return (
              <span className="text-sm text-muted-foreground">Unassigned</span>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <UserAvatar
                name={lecturer.name}
                image={lecturer.image}
                className="h-7 w-7"
              />
              <span className="truncate text-sm">{lecturer.name}</span>
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          return row.original.lecturerId === value;
        },
      },
      {
        id: "enrolled",
        accessorFn: (row) => enrolledCountByClass[row.id] ?? 0,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Enrolled</span>
            <DataTableSorter column={column} label="Enrolled" />
          </div>
        ),
        cell: ({ row }) => {
          const enrolled = enrolledCountByClass[row.original.id] ?? 0;
          const capacity = row.original.capacity;
          const isFull = enrolled >= capacity;
          const isNearFull = !isFull && enrolled / capacity >= 0.8;

          return (
            <span
              className={`text-sm tabular-nums ${
                isFull
                  ? "font-medium text-destructive"
                  : isNearFull
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
              }`}
            >
              {enrolled}
              <span className="text-muted-foreground"> / {capacity}</span>
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Status</span>
            <DataTableSorter column={column} label="Status" />
          </div>
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <ShowButton href={ROUTES.CLASS(row.original.id)} />
            <DeleteButton
              itemName={row.original.name}
              onConfirm={async () => {
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
    [courseById, userById, courseFilterOptions, lecturerFilterOptions, enrolledCountByClass]
  );

  const table = useReactTable({
    data: classes,
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
            title="No classes found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={classes.length} />
    </>
  );
}

ClassesTable.displayName = "ClassesTable";