"use client";

import { useParams } from "next/navigation";

import { ShowView } from "@/components/patterns/show-view";
import { EditButton } from "@/components/patterns/action-buttons";
import { CourseDetail } from "@/components/views/courses/course-detail";
import { courses } from "@/lib/mock";
import { ROUTES } from "@/lib/constants";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const course = courses.find((c) => c.id === id);

  // Not found
  if (!course) {
    return (
      <ShowView
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
      </ShowView>
    );
  }

  return (
    <ShowView
      title={course.name}
      description={course.code}
      breadcrumbs={[
        { label: "Courses", href: ROUTES.COURSES },
        { label: course.name },
      ]}
      backHref={ROUTES.COURSES}
      actions={
        <EditButton
          href={ROUTES.COURSE_EDIT(course.id)}
          label="Edit course"
        />
      }
    >
      <CourseDetail course={course} />
    </ShowView>
  );
}