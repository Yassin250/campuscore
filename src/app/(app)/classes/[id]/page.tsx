"use client";

import { useParams } from "next/navigation";

import { ShowView } from "@/components/patterns/show-view";
import { EditButton } from "@/components/patterns/action-buttons";
import { ClassDetail } from "@/components/views/classes/class-detail";
import { classes } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function ClassDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const classDetails = classes.find((c) => c.id === id);

  if (!classDetails) {
    return (
      <ShowView
        title="Class not found"
        backHref={ROUTES.CLASSES}
        breadcrumbs={[
          { label: "Classes", href: ROUTES.CLASSES },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No class with id{" "}
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
      title={classDetails.name}
      description={classDetails.status === "active" ? "Active" : classDetails.status}
      breadcrumbs={[
        { label: "Classes", href: ROUTES.CLASSES },
        { label: classDetails.name },
      ]}
      backHref={ROUTES.CLASSES}
      actions={
        <EditButton
          href={ROUTES.CLASS_EDIT(classDetails.id)}
          label="Edit class"
        />
      }
    >
      <ClassDetail classDetails={classDetails} />
    </ShowView>
  );
}