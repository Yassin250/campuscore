"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/patterns/page-header";
import { StatCard } from "@/components/patterns/stat-card";
import { BookOpen, Users, ClipboardList, Award } from "lucide-react";

export default function DashboardPage() {
  const user = useCurrentUser();

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description={getGreeting(user.role)}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Courses" value={4} icon={BookOpen} />
        <StatCard label="Students" value={128} icon={Users} />
        <StatCard label="Assignments" value={12} icon={ClipboardList} />
        <StatCard label="Pending" value={14} icon={Award} />
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="text-sm font-semibold">Role: {user.role}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This dashboard will render role-specific content here. Switch the mock
          user in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            hooks/use-current-user.ts
          </code>{" "}
          to see other roles.
        </p>
      </div>
    </>
  );
}

function getGreeting(role: string) {
  switch (role) {
    case "LECTURER":
      return "Here's what's happening in your classes today.";
    case "STUDENT":
      return "Here's what's on your plate.";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "Here's an overview of your institution.";
    default:
      return "Welcome to CampusCore.";
  }
}