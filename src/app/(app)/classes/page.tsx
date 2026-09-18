"use client";

import { ListView } from "@/components/patterns/list-view";
import { CreateButton } from "@/components/patterns/action-buttons";
import { ClassesTable } from "@/components/views/classes/classes-table";
import { ROUTES } from "@/lib/constants";

export default function ClassesPage() {
  return (
    <ListView
      title="Classes"
      description="All class sections across the university."
      breadcrumbs={[{ label: "Classes" }]}
      actions={
        <CreateButton
          href={ROUTES.CLASS_NEW}
          label="New class"
        />
      }
    >
      <ClassesTable />
    </ListView>
  );
}