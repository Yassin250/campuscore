"use client";

import { Mail, Calendar, Building2, BookOpen } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/layout/user-avatar";
import { RoleBadge } from "@/components/patterns/role-badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { ROUTES } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import type { User, Course } from "@/types";

type UserDetailProps = {
  user: User;
  departmentName?: string;
  /** Courses this user teaches (only meaningful for lecturers) */
  taughtCourses?: Course[];
};

export function UserDetail({
  user,
  departmentName,
  taughtCourses = [],
}: UserDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left — profile card */}
      <Card className="lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <UserAvatar
            name={user.name}
            image={user.image}
            className="h-20 w-20 text-2xl"
          />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <RoleBadge role={user.role} />
        </CardContent>
      </Card>

      {/* Right — details */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow icon={Mail} label="Email" value={user.email} />

            {departmentName && (
              <DetailRow
                icon={Building2}
                label="Department"
                value={departmentName}
              />
            )}

            <DetailRow
              icon={Calendar}
              label="Joined"
              value={fmtDate(user.createdAt)}
            />

            {user.bio && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Bio
                  </p>
                  <p className="mt-1 text-sm text-foreground">{user.bio}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Courses taught (only for lecturers) */}
        {user.role === "LECTURER" && (
          <Card>
            <CardHeader>
              <CardTitle>Courses taught</CardTitle>
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
                    <Link
                      key={course.id}
                      href={ROUTES.COURSE(course.id)}
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
                      <Badge variant="outline">{course.code}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

UserDetail.displayName = "UserDetail";