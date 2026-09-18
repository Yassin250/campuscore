"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { ShowButton } from "@/components/patterns/action-buttons";
import {
  courses,
  departments,
} from "@/lib/mock";
import { ROUTES } from "@/lib/constants";
import type { Subject } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type SubjectDetailProps = {
  subject: Subject;
};

export function SubjectDetail({ subject }: SubjectDetailProps) {
  /* ---------- derive related data ---------- */

  const parentDepartment = useMemo(
    () => departments.find((d) => d.id === subject.departmentId),
    [subject.departmentId]
  );

  const subjectCourses = useMemo(
    () => courses.filter((c) => c.subjectId === subject.id),
    [subject.id]
  );

  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {subject.code}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {subject.description || "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Credits"
              value={subject.credits ?? 0}
              icon={GraduationCap}
            />
            <StatCard
              label="Courses"
              value={subjectCourses.length}
              icon={BookOpen}
            />
          </div>
        </CardContent>
      </Card>

      {/* Department link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Offered by</CardTitle>
        </CardHeader>
        <CardContent>
          {parentDepartment ? (
            <Link
              href={ROUTES.DEPARTMENT(parentDepartment.id)}
              className="group flex items-center justify-between rounded-md border border-transparent px-3 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{parentDepartment.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {parentDepartment.description}
                </p>
              </div>
              <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              Department not assigned.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Courses list */}
      <Card>
        <CardHeader>
          <CardTitle>Courses using this subject</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectCourses.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={BookOpen}
              title="No courses yet"
              description="No courses are currently using this subject."
            />
          ) : (
            <div className="space-y-1">
                {subjectCourses.map((course) => (
    <div
      key={course.id}
      className="flex items-center justify-between rounded-md px-3 py-2"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {course.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {course.code}
        </p>
      </div>
-     <Badge variant="secondary" className="ml-3 shrink-0">
-       {course.code}
-     </Badge>
+     <div className="ml-3 flex shrink-0 items-center gap-2">
+       <Badge variant="secondary" className="font-mono text-xs">
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

SubjectDetail.displayName = "SubjectDetail";