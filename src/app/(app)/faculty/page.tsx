"use client";

import { ListView } from "@/components/patterns/list-view";
import { FacultyTable } from "@/components/views/faculty/faculty-table";
import { ROUTES } from "@/lib/constants";

export default function FacultyPage() {
  return (
    <ListView
      title="Faculty"
      description="Teaching staff across the university."
      breadcrumbs={[{ label: "Faculty" }]}
    >
      <FacultyTable />
    </ListView>
  );
}