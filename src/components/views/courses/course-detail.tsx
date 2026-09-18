"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  Megaphone,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { ShowButton } from "@/components/patterns/action-buttons";
import { RoleBadge } from "@/components/patterns/role-badge";
import { UserAvatar } from "@/components/layout/user-avatar";
import {
  announcements,
  assignments,
  classes,
  enrollments,
  subjects,
  users,
} from "@/lib/mock";
import { ROUTES } from "@/lib/constants";
import { fmtRelative, pluralize } from "@/lib/utils";
import type { Course } from "@/types";
import { School } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type CourseDetailProps = {
  course: Course;
};

export function CourseDetail({ course }: CourseDetailProps) {
  /* ---------------- derived data ---------------- */

  const subject = useMemo(
    () => subjects.find((s) => s.id === course.subjectId),
    [course.subjectId]
  );

  const lecturer = useMemo(
    () => users.find((u) => u.id === course.lecturerId),
    [course.lecturerId]
  );

  const courseClasses = useMemo(
    () => classes.filter((c) => c.courseId === course.id),
    [course.id]
  );

  const classIds = useMemo(
    () => new Set(courseClasses.map((c) => c.id)),
    [courseClasses]
  );

  const courseEnrollments = useMemo(
    () => enrollments.filter((e) => classIds.has(e.classId)),
    [classIds]
  );

  const studentIds = useMemo(
    () => new Set(courseEnrollments.map((e) => e.studentId)),
    [courseEnrollments]
  );

  const courseStudents = useMemo(
    () => users.filter((u) => studentIds.has(u.id)),
    [studentIds]
  );

  const courseAssignments = useMemo(
    () => assignments.filter((a) => classIds.has(a.classId)),
    [classIds]
  );

  const courseAnnouncements = useMemo(
    () =>
      announcements
        .filter((a) => classIds.has(a.classId))
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [classIds]
  );

  return (
    <div className="space-y-6">
      {/* Hero card with cover */}
      {course.coverUrl && (
        <div className="overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.coverUrl}
            alt={course.name}
            className="aspect-[3/1] w-full object-cover"
          />
        </div>
      )}

      {/* Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {course.code}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {course.description || "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Classes"
              value={courseClasses.length}
              icon={BookOpen}
              href={ROUTES.COURSES + "/" + course.id + "/classes"}
            />
            <StatCard
              label="Assignments"
              value={courseAssignments.length}
              icon={ClipboardList}
            />
            <StatCard
              label="Students"
              value={courseStudents.length}
              icon={Users}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subject + Lecturer links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {subject && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={ROUTES.SUBJECT(subject.id)}
                className="group flex items-center justify-between rounded-md border border-transparent px-3 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {subject.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {subject.code}
                  </p>
                </div>
                <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </CardContent>
          </Card>
        )}

        {lecturer && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lecturer</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={ROUTES.FACULTY_MEMBER(lecturer.id)}
                className="group flex items-center justify-between rounded-md border border-transparent px-3 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar
                    name={lecturer.name}
                    image={lecturer.image}
                    className="h-9 w-9"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {lecturer.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lecturer.email}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stream" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stream">
            Stream
            {courseAnnouncements.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {courseAnnouncements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments
            {courseAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {courseAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          +   <TabsTrigger value="classes">
      Classes
      {courseClasses.length > 0 && (
        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
          {courseClasses.length}
        </Badge>
      )}
    </TabsTrigger>

          <TabsTrigger value="students">
            Students
            {courseStudents.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {courseStudents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stream">
          <StreamPanel announcements={courseAnnouncements} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsPanel assignments={courseAssignments} />
        </TabsContent>

        + <TabsContent value="classes">
+   <ClassesPanel classes={courseClasses} />
+ </TabsContent>

        <TabsContent value="students">
          <StudentsPanel students={courseStudents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

CourseDetail.displayName = "CourseDetail";

/* ------------------------------------------------------------------ */
/*  Stream panel                                                       */
/* ------------------------------------------------------------------ */

function StreamPanel({
  announcements: items,
}: {
  announcements: typeof announcements;
}) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Updates from the lecturer will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((a) => {
          const author = users.find((u) => u.id === a.authorId);
          return (
            <div
              key={a.id}
              className="rounded-md border-l-2 border-primary/40 bg-muted/20 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  {author && (
                    <UserAvatar
                      name={author.name}
                      image={author.image}
                      className="h-7 w-7"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {author?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fmtRelative(a.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {a.title && (
                <p className="mt-3 text-sm font-semibold">{a.title}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Assignments panel                                                  */
/* ------------------------------------------------------------------ */

function AssignmentsPanel({
  assignments: items,
}: {
  assignments: typeof assignments;
}) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={ClipboardList}
            title="No assignments yet"
            description="Assignments posted by the lecturer will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  const sorted = [...items].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {sorted.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between rounded-md px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {assignment.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {assignment.points} points
              </p>
            </div>
            <Badge variant="secondary" className="ml-3 shrink-0">
              {fmtRelative(assignment.createdAt)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}



/* ------------------------------------------------------------------ */
/*  Classes panel                                                      */
/* ------------------------------------------------------------------ */

function ClassesPanel({
  classes: classList,
}: {
  classes: typeof classes;
}) {
  if (classList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={School}
            title="No classes yet"
            description="Sections of this course will appear here once created."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Classes</CardTitle>
        <Badge variant="secondary">
          {pluralize(classList.length, "section")}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        {classList.map((cls) => (
          <div
            key={cls.id}
            className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{cls.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {cls.status === "active" ? "Active" : cls.status} ·{" "}
                {cls.capacity} capacity
              </p>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-2">
              <Badge
                variant={cls.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {cls.status}
              </Badge>
              <ShowButton href={ROUTES.CLASS(cls.id)} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Students panel                                                     */
/* ------------------------------------------------------------------ */

function StudentsPanel({ students }: { students: typeof users }) {
  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Students enrolled in this course will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrolled students</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {students.map((student) => (
          <Link
            key={student.id}
            href={ROUTES.ADMIN_USER(student.id)}
            className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
          >
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar
                name={student.name}
                image={student.image}
                className="h-8 w-8"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{student.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {student.email}
                </p>
              </div>
            </div>
            <RoleBadge role={student.role} compact />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}