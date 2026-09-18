"use client";

import { ListView } from "@/components/patterns/list-view";
import { CreateButton } from "@/components/patterns/action-buttons";
import { DepartmentsTable } from "@/components/views/departments/departments-table";
import { ROUTES } from "@/lib/constants";

export default function DepartmentsPage() {
  return (
    <ListView
      title="Departments"
      description="Academic departments across the university."
      breadcrumbs={[{ label: "Departments" }]}
      actions={
        <CreateButton
          href={ROUTES.DEPARTMENT_NEW}
          label="New department"
        />
      }
    >
      <DepartmentsTable />
    </ListView>
  );
}