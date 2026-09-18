"use client";

import { useParams } from "next/navigation";

import { ShowView } from "@/components/patterns/show-view";
import { EditButton } from "@/components/patterns/action-buttons";
import { DepartmentDetail } from "@/components/views/departments/department-detail";
import { departments } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const department = departments.find((d) => d.id === id);

  // Not found
  if (!department) {
    return (
      <ShowView
        title="Department not found"
        backHref={ROUTES.DEPARTMENTS}
        breadcrumbs={[
          { label: "Departments", href: ROUTES.DEPARTMENTS },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No department with id <code className="rounded bg-muted px-1 py-0.5 text-xs">{params.id}</code> exists.
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView
      title={department.name}
      description={department.description}
      breadcrumbs={[
        { label: "Departments", href: ROUTES.DEPARTMENTS },
        { label: department.name },
      ]}
      backHref={ROUTES.DEPARTMENTS}
      actions={
        <EditButton
          href={ROUTES.DEPARTMENT_EDIT(department.id)}
          label="Edit department"
        />
      }
    >
      <DepartmentDetail department={department} />
    </ShowView>
  );
}