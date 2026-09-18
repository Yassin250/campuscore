"use client";

import { ListView } from "@/components/patterns/list-view";
import { CreateButton } from "@/components/patterns/action-buttons";
import { CoursesTable } from "@/components/views/courses/courses-table";
import { ROUTES } from "@/lib/constants";

export default function CoursesPage() {
  return (
    <ListView
      title="Courses"
      description="All courses across the university."
      breadcrumbs={[{ label: "Courses" }]}
      actions={
        <CreateButton
          href={ROUTES.COURSE_NEW}
          label="New course"
        />
      }
    >
      <CoursesTable />
    </ListView>
  );
}