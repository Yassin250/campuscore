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
import { Users } from "lucide-react";

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
import { UserInfo } from "@/components/layout/user-info";
import { RoleBadge } from "@/components/patterns/role-badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { notify } from "@/components/notifications/toast-helpers";
import { departments, users } from "@/lib/mock";
import {
  ALL_ROLE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  ROUTES,
} from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import type { User } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Map id → department name, used by the department column's cell
  const departmentNameById = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    []
  );

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>User</span>
            <DataTableSorter column={column} label="User" />
            <DataTableTextFilter
              column={column}
              placeholder="Search by name..."
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
        filterFn: (row, id, value) => {
          const q = String(value).toLowerCase();
          return (
            row.original.name.toLowerCase().includes(q) ||
            row.original.email.toLowerCase().includes(q)
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Role</span>
            <DataTableSorter column={column} label="Role" />
            <DataTableSelectFilter
              column={column}
              options={ALL_ROLE_OPTIONS.map((r) => ({
                label: r.label,
                value: r.value,
              }))}
              placeholder="Any role"
            />
          </div>
        ),
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          if (!value) return true;
          return row.original.role === value;
        },
      },
      {
        accessorKey: "departmentId",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Department</span>
            <DataTableSorter column={column} label="Department" />
          </div>
        ),
        cell: ({ row }) => {
          const id = row.original.departmentId;
          const name = id ? departmentNameById.get(id) : null;
          return (
            <span className="text-sm text-muted-foreground">
              {name ?? "—"}
            </span>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Joined</span>
            <DataTableSorter column={column} label="Joined" />
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {fmtDate(row.original.createdAt)}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <ShowButton href={ROUTES.ADMIN_USER(row.original.id)} />
            <DeleteButton
              itemName={row.original.name}
              onConfirm={async () => {
                // TODO: replace with a real mutation when backend exists
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
    [departmentNameById]
  );

  const table = useReactTable({
    data: users,
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
            icon={Users}
            title="No users found"
            description="Try adjusting your search or filters."
          />
        }
      />
      <DataTablePagination table={table} total={users.length} />
    </>
  );
}

UsersTable.displayName = "UsersTable";