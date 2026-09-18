"use client";

import { ClassDetail } from "@/components/views/classes/class-detail";
import { classes } from "@/lib/mock";

export default function Test() {
  const cls = classes[0]; // CS101-A

  return (
    <div className="mx-auto max-w-5xl p-8">
      <ClassDetail classDetails={cls} />
    </div>
  );
}