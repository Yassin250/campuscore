"use client";

import { ListView } from "@/components/patterns/list-view";
import { CreateButton } from "@/components/patterns/action-buttons";
import { SubjectsTable } from "@/components/views/subjects/subjects-table";
import { ROUTES } from "@/lib/constants";

export default function SubjectsPage() {
  return (
    <ListView
      title="Subjects"
      description="Academic subjects across the university."
      breadcrumbs={[{ label: "Subjects" }]}
      actions={
        <CreateButton
          href={ROUTES.SUBJECT_NEW}
          label="New subject"
        />
      }
    >
      <SubjectsTable />
    </ListView>
  );
}