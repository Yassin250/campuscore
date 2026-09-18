"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  Building2,
  Calendar,
  MoreHorizontal,
  Pencil,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";
import { EmptyState } from "@/components/patterns/empty-state";
import { ShowButton } from "@/components/patterns/action-buttons";
import { UserAvatar } from "@/components/layout/user-avatar";
import { notify } from "@/components/notifications/toast-helpers";
import { courses, departments } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import type { User } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type FacultyDetailProps = {
  faculty: User;
};

export function FacultyDetail({ faculty }: FacultyDetailProps) {
  const router = useRouter();

  const department = useMemo(
    () =>
      faculty.departmentId
        ? departments.find((d) => d.id === faculty.departmentId)
        : undefined,
    [faculty.departmentId]
  );

  const taughtCourses = useMemo(
    () => courses.filter((c) => c.lecturerId === faculty.id),
    [faculty.id]
  );

  const isActive = faculty.active !== false;

  return (
    <div className="space-y-6">
      {/* Profile card with actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <FacultyActions faculty={faculty} />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <UserAvatar
                name={faculty.name}
                image={faculty.image}
                className="h-16 w-16 text-xl"
              />
              <div className="min-w-0 space-y-1">
                <h2 className="text-xl font-semibold">{faculty.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {faculty.email}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="default">Lecturer</Badge>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meta rows */}
          <div className="grid gap-3 sm:grid-cols-2">
            {department && (
              <DetailRow
                icon={Building2}
                label="Department"
                value={department.name}
                href={ROUTES.DEPARTMENT(department.id)}
              />
            )}
            <DetailRow
              icon={Calendar}
              label="Joined"
              value={fmtDate(faculty.createdAt)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      {faculty.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{faculty.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Courses taught */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Courses taught</CardTitle>
          <Badge variant="secondary">{taughtCourses.length}</Badge>
        </CardHeader>
        <CardContent>
          {taughtCourses.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={BookOpen}
              title="No courses yet"
              description="This lecturer isn't assigned to any courses."
            />
          ) : (
            <div className="space-y-1">
                {taughtCourses.map((course) => (
    <div
      key={course.id}
      className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {course.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {course.code}
        </p>
      </div>
      <Badge
        variant="outline"
        className="ml-3 shrink-0 font-mono text-xs"
      >
-       {course.code}
-     </Badge>
+     <div className="ml-3 flex shrink-0 items-center gap-2">
+       <Badge variant="outline" className="font-mono text-xs">
+         {course.code}
+       </Badge>
+       <ShowButton href={ROUTES.COURSE(course.id)} />
+     </div>
    </div>
  ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

FacultyDetail.displayName = "FacultyDetail";

/* ------------------------------------------------------------------ */
/*  Actions dropdown                                                   */
/* ------------------------------------------------------------------ */

function FacultyActions({ faculty }: { faculty: User }) {
  const router = useRouter();
  const isActive = faculty.active !== false;

  const handleDeactivate = async () => {
    // TODO: replace with a real mutation when the backend exists
    notify.success(
      `${faculty.name} deactivated`,
      "This is a placeholder — nothing was actually changed."
    );
  };

  const handleActivate = async () => {
    notify.success(
      `${faculty.name} reactivated`,
      "This is a placeholder — nothing was actually changed."
    );
  };

  const handleResetPassword = () => {
    notify.info(
      "Reset link sent",
      `A password reset link would be sent to ${faculty.email}.`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Faculty actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={() => router.push(ROUTES.FACULTY_MEMBER_EDIT(faculty.id))}
          className="cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Edit profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={handleResetPassword}
          className="cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          Reset password
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isActive ? (
          <ConfirmDialog
            title={`Deactivate ${faculty.name}?`}
            description="They won't be able to sign in or access their classes. Their data is preserved."
            confirmLabel="Deactivate"
            variant="destructive"
            onConfirm={handleDeactivate}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <UserX className="h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            }
          />
        ) : (
          <DropdownMenuItem
            onSelect={handleActivate}
            className="cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail row                                                         */
/* ------------------------------------------------------------------ */

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
      {href && (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}