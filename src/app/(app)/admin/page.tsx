"use client";

import { PageHeader } from "@/components/patterns/page-header";
import { AdminOverview } from "@/components/views/admin/admin-overview";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Admin"
        description="Overview of users, courses, and institution activity."
        breadcrumbs={[{ label: "Admin" }]}
      />
      <div className="mt-6">
        <AdminOverview />
      </div>
    </>
  );
}