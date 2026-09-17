"use client";

import { useParams } from "next/navigation";


import { ShowView } from "@/components/patterns/show-view";
import { UserDetail } from "@/components/views/admin/user-detail";
import { courses, departments, users } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return (
      <ShowView
        title="User not found"
        backHref={ROUTES.ADMIN_USERS}
        breadcrumbs={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Users", href: ROUTES.ADMIN_USERS },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No user with id <code>{params.id}</code> exists.
        </p>
      </ShowView>
    );
  }

  const department = user.departmentId
    ? departments.find((d) => d.id === user.departmentId)
    : undefined;

  const taughtCourses = courses.filter((c) => c.lecturerId === user.id);

  return (
    <ShowView
      title={user.name}
      description={user.email}
      breadcrumbs={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Users", href: ROUTES.ADMIN_USERS },
        { label: user.name },
      ]}
      backHref={ROUTES.ADMIN_USERS}
      
    >
      <UserDetail
        user={user}
        departmentName={department?.name}
        taughtCourses={taughtCourses}
      />
    </ShowView>
  );
}