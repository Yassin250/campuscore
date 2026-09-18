"use client";

import { useParams, useRouter } from "next/navigation";

import { EditView } from "@/components/patterns/edit-view";
import { DepartmentForm } from "@/components/views/departments/department-form";
import { notify } from "@/components/notifications/toast-helpers";
import { departments } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function EditDepartmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const department = departments.find((d) => d.id === id);

  // Not found
  if (!department) {
    return (
      <EditView
        title="Department not found"
        backHref={ROUTES.DEPARTMENTS}
        breadcrumbs={[
          { label: "Departments", href: ROUTES.DEPARTMENTS },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No department with id{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {params.id}
          </code>{" "}
          exists.
        </p>
      </EditView>
    );
  }

  const handleSubmit = async (values: {
    name: string;
    code: string;
    description: string;
  }) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));
    notify.success("Department updated", `${values.name} has been saved.`);
    router.push(ROUTES.DEPARTMENT(department.id));
  };

  return (
    <EditView
      title={`Edit ${department.name}`}
      description="Update the department details below."
      breadcrumbs={[
        { label: "Departments", href: ROUTES.DEPARTMENTS },
        { label: department.name, href: ROUTES.DEPARTMENT(department.id) },
        { label: "Edit" },
      ]}
      backHref={ROUTES.DEPARTMENT(department.id)}
    >
      <div className="max-w-2xl">
        <DepartmentForm
          mode="edit"
          defaultValues={department}
          onSubmit={handleSubmit}
        />
      </div>
    </EditView>
  );
}