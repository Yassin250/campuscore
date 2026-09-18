"use client";

import { useParams } from "next/navigation";

import { ShowView } from "@/components/patterns/show-view";
import { FacultyDetail } from "@/components/views/faculty/faculty-detail";
import { users } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function FacultyMemberPage() {
  const params = useParams<{ id: string }>();
  const faculty = users.find((u) => u.id === params.id);

  // Not found
  if (!faculty) {
    return (
      <ShowView
        title="Faculty member not found"
        backHref={ROUTES.FACULTY}
        breadcrumbs={[
          { label: "Faculty", href: ROUTES.FACULTY },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No faculty member with id{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {params.id}
          </code>{" "}
          exists.
        </p>
      </ShowView>
    );
  }

  // Non-lecturers shouldn't render here — redirect to their proper page
  if (faculty.role !== "LECTURER") {
    return (
      <ShowView
        title={faculty.name}
        description="This user is not a lecturer."
        backHref={ROUTES.FACULTY}
        breadcrumbs={[
          { label: "Faculty", href: ROUTES.FACULTY },
          { label: faculty.name },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          {faculty.name} is a{" "}
          <span className="font-medium">{faculty.role.toLowerCase()}</span>,
          not a lecturer. You can view their profile on the users page.
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView
      title={faculty.name}
      description={faculty.email}
      breadcrumbs={[
        { label: "Faculty", href: ROUTES.FACULTY },
        { label: faculty.name },
      ]}
      backHref={ROUTES.FACULTY}
    >
      <FacultyDetail faculty={faculty} />
    </ShowView>
  );
}