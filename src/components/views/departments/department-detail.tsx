"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, Layers, Users } from "lucide-react";

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
import { ShowButton } from "@/components/patterns/action-buttons";
import { EmptyState } from "@/components/patterns/empty-state";
import { UserInfo } from "@/components/layout/user-info";
import { RoleBadge } from "@/components/patterns/role-badge";
import {
  classes,
  courses,
  enrollments,
  subjects,
  users,
} from "@/lib/mock";
import { ROUTES } from "@/lib/constants";
import type { Department } from "@/types";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type DepartmentDetailProps = {
  department: Department;
};

export function DepartmentDetail({ department }: DepartmentDetailProps) {
  /* ---------- derive related data ---------- */

  const deptSubjects = useMemo(
    () => subjects.filter((s) => s.departmentId === department.id),
    [department.id]
  );

  const subjectIds = useMemo(
    () => new Set(deptSubjects.map((s) => s.id)),
    [deptSubjects]
  );

  const deptCourses = useMemo(
    () => courses.filter((c) => subjectIds.has(c.subjectId)),
    [subjectIds]
  );

  const courseIds = useMemo(
    () => new Set(deptCourses.map((c) => c.id)),
    [deptCourses]
  );

  const deptClasses = useMemo(
    () => classes.filter((c) => courseIds.has(c.courseId)),
    [courseIds]
  );

  const classIds = useMemo(
    () => new Set(deptClasses.map((c) => c.id)),
    [deptClasses]
  );

  const deptEnrollments = useMemo(
    () => enrollments.filter((e) => classIds.has(e.classId)),
    [classIds]
  );

  const studentIds = useMemo(
    () => new Set(deptEnrollments.map((e) => e.studentId)),
    [deptEnrollments]
  );

  const deptStudents = useMemo(
    () => users.filter((u) => studentIds.has(u.id)),
    [studentIds]
  );

  const deptTeachers = useMemo(
    () =>
      users.filter(
        (u) => u.role === "LECTURER" && deptCourses.some((c) => c.lecturerId === u.id)
      ),
    [deptCourses]
  );

  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {department.description || "No description provided."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Subjects"
              value={deptSubjects.length}
              icon={BookOpen}
            />
            <StatCard
              label="Classes"
              value={deptClasses.length}
              icon={Layers}
            />
            <StatCard
              label="Enrolled students"
              value={deptStudents.length}
              icon={Users}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">
            Subjects ({deptSubjects.length})
          </TabsTrigger>
          <TabsTrigger value="classes">
            Classes ({deptClasses.length})
          </TabsTrigger>
          <TabsTrigger value="teachers">
            Teachers ({deptTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({deptStudents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects">
          <SubjectsPanel subjects={deptSubjects} />
        </TabsContent>

        <TabsContent value="classes">
          <ClassesPanel
            classes={deptClasses}
            deptCourses={deptCourses}
          />
        </TabsContent>

        <TabsContent value="teachers">
          <PeoplePanel
            title="Teachers"
            description="Lecturers teaching courses in this department."
            people={deptTeachers}
            emptyIcon={Users}
            emptyTitle="No teachers assigned"
            emptyDescription="This department has no lecturers assigned to its courses."
          />
        </TabsContent>

        <TabsContent value="students">
          <PeoplePanel
            title="Students"
            description="Students enrolled in classes within this department."
            people={deptStudents}
            emptyIcon={Users}
            emptyTitle="No students enrolled"
            emptyDescription="No students are currently enrolled in this department's classes."
            clickable
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

DepartmentDetail.displayName = "DepartmentDetail";

/* ------------------------------------------------------------------ */
/*  Subjects panel                                                     */
/* ------------------------------------------------------------------ */

function SubjectsPanel({
  subjects: subjectList,
}: {
  subjects: typeof subjects;
}) {
  if (subjectList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="This department doesn't have any subjects."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
          {subjectList.map((subject) => (
    <div
      key={subject.id}
      className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{subject.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {subject.description}
        </p>
      </div>
-     <Badge variant="outline" className="ml-3 shrink-0 font-mono text-xs">
-       {subject.code}
-     </Badge>
+     <div className="ml-3 flex shrink-0 items-center gap-2">
+       <Badge variant="outline" className="font-mono text-xs">
+         {subject.code}
+       </Badge>
+       <ShowButton href={ROUTES.SUBJECT(subject.id)} />
+     </div>
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
  deptCourses,
}: {
  classes: typeof classes;
  deptCourses: typeof courses;
}) {
  const courseNameById = useMemo(
    () => new Map(deptCourses.map((c) => [c.id, c.name])),
    [deptCourses]
  );

  const teacherNameById = useMemo(
    () => new Map(users.map((u) => [u.id, u.name])),
    []
  );

  if (classList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Layers}
            title="No classes yet"
            description="This department doesn't have any classes running."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classes</CardTitle>
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
                {courseNameById.get(cls.courseId) ?? "Unknown course"} ·{" "}
                {teacherNameById.get(cls.lecturerId) ?? "Unassigned"}
              </p>
            </div>
            <Badge
              variant={cls.status === "active" ? "default" : "secondary"}
              className="ml-3 shrink-0"
            >
              {cls.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  People panel (teachers + students)                                 */
/* ------------------------------------------------------------------ */

function PeoplePanel({
  title,
  description,
  people,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  clickable = false,
}: {
  title: string;
  description: string;
  people: typeof users;
  emptyIcon: typeof Users;
  emptyTitle: string;
  emptyDescription: string;
  clickable?: boolean;
}) {
  if (people.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        </CardContent>
      </Card>
    );
  }

  const RowWrapper = clickable
    ? ({ person, children }: { person: typeof users[number]; children: React.ReactNode }) => (
        <Link
          href={ROUTES.ADMIN_USER(person.id)}
          className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
        >
          {children}
        </Link>
      )
    : ({ children }: { person: typeof users[number]; children: React.ReactNode }) => (
        <div className="flex items-center justify-between rounded-md px-3 py-2">
          {children}
        </div>
      );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        {people.map((person) => (
          <RowWrapper key={person.id} person={person}>
            <UserInfo
              name={person.name}
              email={person.email}
              image={person.image}
              avatarClassName="h-8 w-8"
              size="sm"
            />
            <RoleBadge role={person.role} compact />
          </RowWrapper>
        ))}
      </CardContent>
    </Card>
  );
}