"use client";

import { useParams, useRouter } from "next/navigation";

import { EditView } from "@/components/patterns/edit-view";
import { CourseForm } from "@/components/views/courses/course-form";
import { notify } from "@/components/notifications/toast-helpers";
import { courses } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const course = courses.find((c) => c.id === id);

  // Not found
  if (!course) {
    return (
      <EditView
        title="Course not found"
        backHref={ROUTES.COURSES}
        breadcrumbs={[
          { label: "Courses", href: ROUTES.COURSES },
          { label: "Not found" },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          No course with id{" "}
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
      code: string;
      subjectId: number;
      lecturerId: string;
      description: string;
    },
    cover: {
      url: string;
      publicId: string;
    } | null
  ) => {
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));

    console.log("[edit course] payload:", {
      id: course.id,
      ...values,
      coverUrl: cover?.url,
      coverCldPubId: cover?.publicId,
    });

    notify.success("Course updated", `${values.name} has been saved.`);
    router.push(ROUTES.COURSE(course.id));
  };

  return (
    <EditView
      title={`Edit ${course.name}`}
      description="Update the course details below."
      breadcrumbs={[
        { label: "Courses", href: ROUTES.COURSES },
        { label: course.name, href: ROUTES.COURSE(course.id) },
        { label: "Edit" },
      ]}
      backHref={ROUTES.COURSE(course.id)}
    >
      <div className="max-w-3xl">
        <CourseForm
          mode="edit"
          defaultValues={course}
          onSubmit={handleSubmit}
        />
      </div>
    </EditView>
  );
}