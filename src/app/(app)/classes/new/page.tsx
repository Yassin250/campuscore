"use client";

import { useRouter } from "next/navigation";

import { CreateView } from "@/components/patterns/create-view";
import { ClassForm } from "@/components/views/classes/class-form";
import { notify } from "@/components/notifications/toast-helpers";
import { ROUTES } from "@/lib/constants";

export default function NewClassPage() {
  const router = useRouter();

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
    // TODO: replace with a real API call when backend exists
    await new Promise((r) => setTimeout(r, 800));

    console.log("[create class] payload:", {
      ...values,
      bannerUrl: banner?.url,
      bannerCldPubId: banner?.publicId,
      joinCode,
    });

    notify.success("Class created", `${values.name} is now live.`);
    router.push(ROUTES.CLASSES);
  };

  return (
    <CreateView
      title="Create class"
      description="Add a new class section to a course."
      breadcrumbs={[
        { label: "Classes", href: ROUTES.CLASSES },
        { label: "Create" },
      ]}
      backHref={ROUTES.CLASSES}
    >
      <div className="max-w-3xl">
        <ClassForm mode="create" onSubmit={handleSubmit} />
      </div>
    </CreateView>
  );
}