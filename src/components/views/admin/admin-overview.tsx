"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { UserInfo } from "@/components/layout/user-info";
import {
  classes,
  departments,
  subjects,
  users,
} from "@/lib/mock";
import { ROLE_LABELS, ROUTES } from "@/lib/constants";
import { countBy, fmtRelative } from "@/lib/utils";
import type { Role } from "@/types";

/* ------------------------------------------------------------------ */
/*  Chart colors — use your design tokens so dark mode just works     */
/* ------------------------------------------------------------------ */

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AdminOverview() {
  /* ---------------- aggregations ---------------- */

  const usersByRole = useMemo(() => {
    const counts = countBy(users, (u) => u.role);
    return Object.entries(counts).map(([role, total]) => ({
      role,
      roleLabel: ROLE_LABELS[role as Role] ?? role,
      total,
    }));
  }, []);

  const subjectsByDepartment = useMemo(() => {
    const deptById = new Map(departments.map((d) => [d.id, d.name]));
    const counts = countBy(
      subjects,
      (s) => deptById.get(s.departmentId) ?? "Unassigned"
    );
    return Object.entries(counts)
      .map(([departmentName, totalSubjects]) => ({
        departmentName,
        totalSubjects,
      }))
      .sort((a, b) => b.totalSubjects - a.totalSubjects);
  }, []);

  const classesBySubject = useMemo(() => {
    const subjectById = new Map(subjects.map((s) => [s.id, s.name]));
    const counts = countBy(
      classes,
      (c) => subjectById.get(c.courseId) ?? "Unassigned"
    );
    return Object.entries(counts)
      .map(([subjectName, totalClasses]) => ({
        subjectName,
        totalClasses,
      }))
      .sort((a, b) => b.totalClasses - a.totalClasses);
  }, []);

  const newestUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    []
  );

  const newestClasses = useMemo(
    () =>
      [...classes]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    []
  );

  /* ---------------- KPIs ---------------- */

  const lecturerCount = users.filter((u) => u.role === "LECTURER").length;
  const adminCount = users.filter(
    (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
  ).length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;

  const kpis = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Lecturers", value: lecturerCount, icon: GraduationCap },
    { label: "Students", value: studentCount, icon: Users },
    { label: "Admins", value: adminCount, icon: ShieldCheck },
    { label: "Subjects", value: subjects.length, icon: BookOpen },
    { label: "Classes", value: classes.length, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Users by role + small counts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="total"
                    nameKey="roleLabel"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell
                        key={entry.role}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-2">
              {usersByRole.map((entry, index) => (
                <span
                  key={entry.role}
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  {entry.roleLabel} · {entry.total}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{departments.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Across the university
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">New classes (last 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{newestClasses.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Most recently created
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bar charts */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Subjects per Department
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectsByDepartment}>
                  <XAxis
                    dataKey="departmentName"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="totalSubjects"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Classes per Subject
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classesBySubject}>
                  <XAxis
                    dataKey="subjectName"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="totalClasses"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newest users + classes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Newest Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {newestUsers.length === 0 ? (
              <EmptyState
                variant="compact"
                icon={Users}
                title="No users yet"
                description="Invite users to get started."
              />
            ) : (
              newestUsers.map((user) => (
                <Link
                  key={user.id}
                  href={ROUTES.ADMIN_USER(user.id)}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
                >
                  <UserInfo
                    name={user.name}
                    email={user.email}
                    image={user.image}
                    avatarClassName="h-8 w-8"
                    size="sm"
                  />
                  <Badge variant="secondary">New</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newest Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {newestClasses.length === 0 ? (
              <EmptyState
                variant="compact"
                icon={BookOpen}
                title="No classes yet"
                description="Create a class to get started."
              />
            ) : (
              newestClasses.map((cls, index) => (
                <Link
                  key={cls.id}
                  href={ROUTES.CLASS(cls.id)}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{cls.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {fmtRelative(cls.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

AdminOverview.displayName = "AdminOverview";