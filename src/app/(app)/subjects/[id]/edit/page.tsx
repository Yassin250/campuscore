"use client";

import { useParams, useRouter } from "next/navigation";

import { EditView } from "@/components/patterns/edit-view";
import { SubjectForm } from "@/components/views/subjects/subject-form";
import { notify } from "@/components/notifications/toast-helpers";
import { subjects } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function EditSubjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const subject = subjects.find((s) => s.id === id);

  // Not found
  if (!subject) {
    return (
      <EditView
        title="Subject not found"
        backHref={ROUTES.SUBJECTS}
        breadcrumbs={[
          { label: "Subjects", href: ROUTES.SUBJECTS },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No subject with id{" "}
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
    departmentId: number;
    credits: number;
    description: string;
  }) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));
    notify.success("Subject updated", `${values.name} has been saved.`);
    router.push(ROUTES.SUBJECT(subject.id));
  };

  return (
    <EditView
      title={`Edit ${subject.name}`}
      description="Update the subject details below."
      breadcrumbs={[
        { label: "Subjects", href: ROUTES.SUBJECTS },
        { label: subject.name, href: ROUTES.SUBJECT(subject.id) },
        { label: "Edit" },
      ]}
      backHref={ROUTES.SUBJECT(subject.id)}
    >
      <div className="max-w-2xl">
        <SubjectForm
          mode="edit"
          defaultValues={subject}
          onSubmit={handleSubmit}
        />
      </div>
    </EditView>
  );
}