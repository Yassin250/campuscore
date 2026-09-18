"use client";

import { useRouter } from "next/navigation";

import { CreateView } from "@/components/patterns/create-view";
import { SubjectForm } from "@/components/views/subjects/subject-form";
import { notify } from "@/components/notifications/toast-helpers";
import { ROUTES } from "@/lib/constants";

export default function NewSubjectPage() {
  const router = useRouter();

  const handleSubmit = async (values: {
    name: string;
    code: string;
    departmentId: number;
    credits: number;
    description: string;
  }) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));
    notify.success("Subject created", `${values.name} has been added.`);
    router.push(ROUTES.SUBJECTS);
  };

  return (
    <CreateView
      title="Create subject"
      description="Add a new academic subject to a department."
      breadcrumbs={[
        { label: "Subjects", href: ROUTES.SUBJECTS },
        { label: "Create" },
      ]}
      backHref={ROUTES.SUBJECTS}
    >
      <div className="max-w-2xl">
        <SubjectForm mode="create" onSubmit={handleSubmit} />
      </div>
    </CreateView>
  );
}