"use client";

import { useParams, useRouter } from "next/navigation";

import { EditView } from "@/components/patterns/edit-view";
import { ClassForm } from "@/components/views/classes/class-form";
import { notify } from "@/components/notifications/toast-helpers";
import { classes } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function EditClassPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const classDetails = classes.find((c) => c.id === id);

  if (!classDetails) {
    return (
      <EditView
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
      </EditView>
    );
  }

  const handleSubmit = async (
    values: {
      name: string;
      courseId: number;
      lecturerId: string;
      capacity: number;
      status: "active" | "inactive" | "archived";
      description: string;
      schedules: {
        day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
        startTime: string;
        endTime: string;
        room?: string;
      }[];
    },
    banner: { url: string; publicId: string } | null,
    joinCode: string
  ) => {
    await new Promise((r) => setTimeout(r, 800));

    console.log("[edit class] payload:", {
      id: classDetails.id,
      ...values,
      bannerUrl: banner?.url,
      bannerCldPubId: banner?.publicId,
      joinCode,
    });

    notify.success("Class updated", `${values.name} has been saved.`);
    router.push(ROUTES.CLASS(classDetails.id));
  };

  return (
    <EditView
      title={`Edit ${classDetails.name}`}
      description="Update the class details below."
      breadcrumbs={[
        { label: "Classes", href: ROUTES.CLASSES },
        { label: classDetails.name, href: ROUTES.CLASS(classDetails.id) },
        { label: "Edit" },
      ]}
      backHref={ROUTES.CLASS(classDetails.id)}
    >
      <div className="max-w-3xl">
        <ClassForm
          mode="edit"
          defaultValues={classDetails}
          onSubmit={handleSubmit}
        />
      </div>
    </EditView>
  );
}