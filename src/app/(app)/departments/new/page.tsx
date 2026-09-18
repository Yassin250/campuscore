"use client";

import { useRouter } from "next/navigation";

import { CreateView } from "@/components/patterns/create-view";
import { DepartmentForm } from "@/components/views/departments/department-form";
import { notify } from "@/components/notifications/toast-helpers";
import { ROUTES } from "@/lib/constants";

export default function NewDepartmentPage() {
  const router = useRouter();

  const handleSubmit = async (values: {
    name: string;
    code: string;
    description: string;
  }) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    notify.success("Department created", `${values.name} has been added.`);
    router.push(ROUTES.DEPARTMENTS);
  };

  return (
    <CreateView
      title="Create department"
      description="Add a new academic department to the university."
      breadcrumbs={[
        { label: "Departments", href: ROUTES.DEPARTMENTS },
        { label: "Create" },
      ]}
      backHref={ROUTES.DEPARTMENTS}
    >
      <div className="max-w-2xl">
        <DepartmentForm mode="create" onSubmit={handleSubmit} />
      </div>
    </CreateView>
  );
}