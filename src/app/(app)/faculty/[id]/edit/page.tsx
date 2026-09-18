"use client";

import { useParams, useRouter } from "next/navigation";

import { EditView } from "@/components/patterns/edit-view";
import { FacultyForm } from "@/components/views/faculty/faculty-form";
import { notify } from "@/components/notifications/toast-helpers";
import { users } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function EditFacultyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const faculty = users.find((u) => u.id === params.id);

  // Not found
  if (!faculty) {
    return (
      <EditView
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
      </EditView>
    );
  }

  // Non-lecturers can't be edited here
  if (faculty.role !== "LECTURER") {
    return (
      <EditView
        title="Not a lecturer"
        backHref={ROUTES.FACULTY}
        breadcrumbs={[
          { label: "Faculty", href: ROUTES.FACULTY },
          { label: "Not a lecturer" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          {faculty.name} is a{" "}
          <span className="font-medium">{faculty.role.toLowerCase()}</span>.
          Only lecturers can be edited from this page.
        </p>
      </EditView>
    );
  }

  const handleSubmit = async (values: {
    name: string;
    email: string;
    departmentId: number;
    bio?: string;
    active: boolean;
  }) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));
    notify.success(
      "Faculty updated",
      `${values.name}'s profile has been saved.`
    );
    router.push(ROUTES.FACULTY_MEMBER(faculty.id));
  };

  return (
    <EditView
      title={`Edit ${faculty.name}`}
      description="Update the lecturer's profile information."
      breadcrumbs={[
        { label: "Faculty", href: ROUTES.FACULTY },
        { label: faculty.name, href: ROUTES.FACULTY_MEMBER(faculty.id) },
        { label: "Edit" },
      ]}
      backHref={ROUTES.FACULTY_MEMBER(faculty.id)}
    >
      <div className="max-w-2xl">
        <FacultyForm
          defaultValues={faculty}
          onSubmit={handleSubmit}
        />
      </div>
    </EditView>
  );
}