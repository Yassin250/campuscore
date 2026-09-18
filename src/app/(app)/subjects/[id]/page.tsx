"use client";

import { useParams } from "next/navigation";

import { ShowView } from "@/components/patterns/show-view";
import { EditButton } from "@/components/patterns/action-buttons";
import { SubjectDetail } from "@/components/views/subjects/subject-detail";
import { subjects } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function SubjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const subject = subjects.find((s) => s.id === id);

  // Not found
  if (!subject) {
    return (
      <ShowView
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
      </ShowView>
    );
  }

  return (
    <ShowView
      title={subject.name}
      description={subject.description}
      breadcrumbs={[
        { label: "Subjects", href: ROUTES.SUBJECTS },
        { label: subject.name },
      ]}
      backHref={ROUTES.SUBJECTS}
      actions={
        <EditButton
          href={ROUTES.SUBJECT_EDIT(subject.id)}
          label="Edit subject"
        />
      }
    >
      <SubjectDetail subject={subject} />
    </ShowView>
  );
}