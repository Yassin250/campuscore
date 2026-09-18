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
import { BookOpen, ImageIcon } from "lucide-react";

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
  courses,
  subjects,
  users,
} from "@/lib/mock";
import { DEFAULT_PAGE_SIZE, ROUTES } from "@/lib/constants";
import { countBy, truncate } from "@/lib/utils";
import type { Course } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CoursesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Lookups
  const subjectById = useMemo(
    () => new Map(subjects.map((s) => [s.id, s])),
    []
  );
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), []);

  // Options for the subject select filter
  const subjectFilterOptions = useMemo(
    () =>
      [...subjects]
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((s) => ({
          label: `${s.code} — ${s.name}`,
          value: String(s.id),
        })),
    []
  );

  // Options for the lecturer select filter
  const lecturerFilterOptions = useMemo(
    () =>
      users
        .filter((u) => u.role === "LECTURER")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => ({ label: u.name, value: u.id })),
    []
  );

  // Counts — future-proofing for classes
  const courseCount = useMemo(() => countBy(courses, (c) => c.id), []);

  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Course</span>
            <DataTableSorter column={column} label="Course" />
            <DataTableTextFilter
              column={column}
              placeholder="Filter by name or code..."
            />
          </div>
        ),
        cell: ({ row }) => {
          const course = row.original;
          return (
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                {course.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.coverUrl}
                    alt={course.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{course.name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {course.code}
                </p>
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          const q = String(value).toLowerCase();
          return (
            row.original.name.toLowerCase().includes(q) ||
            row.original.code.toLowerCase().includes(q)
          );
        },
      },
      {
        id: "subject",
        accessorFn: (row) => subjectById.get(row.subjectId)?.name ?? "—",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Subject</span>
            <DataTableSorter column={column} label="Subject" />
            <DataTableSelectFilter
              column={column}
              options={subjectFilterOptions}
              placeholder="Any subject"
            />
          </div>
        ),
        cell: ({ row }) => {
          const subject = subjectById.get(row.original.subjectId);
          return subject ? (
            <Badge variant="outline" className="font-mono text-xs">
              {subject.code}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _id, value) => {
          if (!value) return true;
          return String(row.original.subjectId) === value;
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-sm text-muted-foreground">
            {truncate(row.original.description || "", 80) || "—"}
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
            <ShowButton href={ROUTES.COURSE(row.original.id)} />
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
    [subjectById, userById, subjectFilterOptions, lecturerFilterOptions]
  );

  const table = useReactTable({
    data: courses,
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
            title="No courses found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={courses.length} />
    </>
  );
}

CoursesTable.displayName = "CoursesTable";