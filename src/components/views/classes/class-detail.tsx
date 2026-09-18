"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  Clock,
  Copy,
  DoorOpen,
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
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { RoleBadge } from "@/components/patterns/role-badge";
import { UserAvatar } from "@/components/layout/user-avatar";
import { notify } from "@/components/notifications/toast-helpers";
import {
  announcements,
  assignments,
  courses,
  enrollments,
  users,
} from "@/lib/mock";
import { ROUTES } from "@/lib/constants";
import { cn, fmtRelative } from "@/lib/utils";
import { formatJoinCode } from "@/lib/joinCode";
import type { ClassDetails } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type ClassDetailProps = {
  classDetails: ClassDetails;
};

export function ClassDetail({ classDetails }: ClassDetailProps) {
  /* ---------------- derived data ---------------- */

  const course = useMemo(
    () => courses.find((c) => c.id === classDetails.courseId),
    [classDetails.courseId]
  );

  const lecturer = useMemo(
    () => users.find((u) => u.id === classDetails.lecturerId),
    [classDetails.lecturerId]
  );

  const classEnrollments = useMemo(
    () =>
      enrollments.filter(
        (e) => e.classId === classDetails.id && e.status === "active"
      ),
    [classDetails.id]
  );

  const studentIds = useMemo(
    () => new Set(classEnrollments.map((e) => e.studentId)),
    [classEnrollments]
  );

  const students = useMemo(
    () => users.filter((u) => studentIds.has(u.id)),
    [studentIds]
  );

  const classAssignments = useMemo(
    () => assignments.filter((a) => a.classId === classDetails.id),
    [classDetails.id]
  );

  const classAnnouncements = useMemo(
    () =>
      announcements
        .filter((a) => a.classId === classDetails.id)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [classDetails.id]
  );

  const enrolledCount = students.length;
  const capacity = classDetails.capacity;
  const spotsLeft = Math.max(0, capacity - enrolledCount);
  const isFull = spotsLeft === 0;

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      {classDetails.bannerUrl && (
        <div className="overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={classDetails.bannerUrl}
            alt={classDetails.name}
            className="aspect-[3/1] w-full object-cover"
          />
        </div>
      )}

      {/* Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <StatusPill status={classDetails.status} />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {classDetails.description || "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Enrolled"
              value={`${enrolledCount} / ${capacity}`}
              icon={Users}
              hint={isFull ? "Class is full" : `${spotsLeft} spots left`}
            />
            <StatCard
              label="Assignments"
              value={classAssignments.length}
              icon={ClipboardList}
            />
            <StatCard
              label="Announcements"
              value={classAnnouncements.length}
              icon={Megaphone}
            />
          </div>
        </CardContent>
      </Card>

      {/* Join code card — most prominent */}
      <JoinCodeCard joinCode={classDetails.joinCode} />

      {/* Course + Lecturer links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {course && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Course</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={ROUTES.COURSE(course.id)}
                className="group flex items-center justify-between rounded-md border border-transparent px-3 py-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{course.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {course.code}
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

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {classDetails.schedules.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={Calendar}
              title="No schedule set"
              description="This class doesn't have any scheduled meeting times."
            />
          ) : (
            <div className="space-y-2">
              {classDetails.schedules.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <Badge
                    variant="outline"
                    className="font-mono text-xs uppercase"
                  >
                    {slot.day}
                  </Badge>

                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {slot.startTime} – {slot.endTime}
                  </span>

                  {slot.room && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <DoorOpen className="h-3.5 w-3.5" />
                      {slot.room}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="stream" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stream">
            Stream
            {classAnnouncements.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {classAnnouncements.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments
            {classAssignments.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {classAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="students">
            Students
            {students.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                {students.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stream">
          <StreamPanel announcements={classAnnouncements} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsPanel assignments={classAssignments} />
        </TabsContent>

        <TabsContent value="students">
          <StudentsPanel students={students} capacity={capacity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

ClassDetail.displayName = "ClassDetail";

/* ------------------------------------------------------------------ */
/*  Join code card                                                     */
/* ------------------------------------------------------------------ */

function JoinCodeCard({ joinCode }: { joinCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      notify.success("Copied", "Join code copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("Copy failed", "Copy manually: " + joinCode);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm">Join code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-wider">
              {formatJoinCode(joinCode)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share this code with students so they can enroll.
            </p>
          </div>

          <Button
            type="button"
            variant={copied ? "secondary" : "default"}
            onClick={handleCopy}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Status pill                                                        */
/* ------------------------------------------------------------------ */

function StatusPill({ status }: { status: ClassDetails["status"] }) {
  const styles: Record<ClassDetails["status"], string> = {
    active: "text-emerald-700 dark:text-emerald-400",
    inactive: "text-muted-foreground",
    archived: "text-amber-700 dark:text-amber-400",
  };

  const dotStyles: Record<ClassDetails["status"], string> = {
    active: "bg-emerald-500",
    inactive: "bg-muted-foreground",
    archived: "bg-amber-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])}
      />
      {status}
    </span>
  );
}

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
/*  Students panel                                                     */
/* ------------------------------------------------------------------ */

function StudentsPanel({
  students,
  capacity,
}: {
  students: typeof users;
  capacity: number;
}) {
  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Students who enroll with the join code will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enrolled students</CardTitle>
        <Badge variant="secondary">
          {students.length} / {capacity}
        </Badge>
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