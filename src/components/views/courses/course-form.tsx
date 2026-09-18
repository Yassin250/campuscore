"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  FormActions,
  FormField,
  FormSection,
  FormShell,
} from "@/components/patterns/forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUploader } from "@/components/uploads/cloudinary-uploader";
import { subjects, users } from "@/lib/mock";
import { CLOUDINARY_FOLDERS } from "@/lib/constants";
import type { CloudinaryAsset, Course } from "@/types";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const courseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be at most 10 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  subjectId: z
    .number({ message: "Please select a subject" })
    .int()
    .positive("Please select a subject"),
  lecturerId: z
    .string()
    .min(1, "Please select a lecturer"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type CourseFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<Course>;
  onSubmit: (
    values: CourseFormValues,
    cover: CloudinaryAsset | null
  ) => Promise<void> | void;
};

export function CourseForm({
  mode,
  defaultValues,
  onSubmit,
}: CourseFormProps) {
  const router = useRouter();

  // Cover image state — kept separate from the form because it's a controlled
  // array (allows future multiple covers) but for now we take the first item.
  const [coverAssets, setCoverAssets] = useState<CloudinaryAsset[]>(
    defaultValues?.coverUrl
      ? [
          {
            url: defaultValues.coverUrl,
            publicId: defaultValues.coverCldPubId ?? "",
            type: "image",
          },
        ]
      : []
  );

  // Sorted subjects for the dropdown
  const sortedSubjects = useMemo(
    () =>
      [...subjects].sort((a, b) =>
        `${a.code} ${a.name}`.localeCompare(`${b.code} ${b.name}`)
      ),
    []
  );

  // Lecturers only, sorted by name
  const lecturers = useMemo(
    () =>
      users
        .filter((u) => u.role === "LECTURER" && u.active !== false)
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      subjectId: defaultValues?.subjectId ?? 0,
      lecturerId: defaultValues?.lecturerId ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedSubjectId = watch("subjectId");
  const selectedLecturerId = watch("lecturerId");

  const handleCancel = () => {
    router.back();
  };

  const submitLabel =
    mode === "create" ? "Create course" : "Save changes";
  const submittingLabel =
    mode === "create" ? "Creating..." : "Saving...";

  const handleFormSubmit = async (values: CourseFormValues) => {
    await onSubmit(values, coverAssets[0] ?? null);
  };

  return (
    <FormShell onSubmit={handleSubmit(handleFormSubmit)}>
      <FormSection
        title="Basic information"
        description="The course name, code, and parent subject."
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <FormField
            label="Name"
            error={errors.name?.message}
            required
            htmlFor="name"
          >
            <Input
              id="name"
              placeholder="Introduction to Programming"
              autoComplete="off"
              autoFocus={mode === "create"}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Code"
            error={errors.code?.message}
            required
            htmlFor="code"
          >
            <Input
              id="code"
              placeholder="CS101"
              autoComplete="off"
              className="uppercase"
              {...register("code", {
                setValueAs: (v) => String(v).toUpperCase(),
              })}
            />
          </FormField>
        </div>

        <FormField
          label="Subject"
          description="The academic subject this course belongs to."
          error={errors.subjectId?.message}
          required
          htmlFor="subjectId"
        >
          <Select
            value={selectedSubjectId ? String(selectedSubjectId) : ""}
            onValueChange={(value) => {
              setValue("subjectId", Number(value), {
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger id="subjectId">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {sortedSubjects.map((subject) => (
                <SelectItem key={subject.id} value={String(subject.id)}>
                  {subject.code} — {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <FormSection
        title="Teaching"
        description="Assign a lecturer to lead this course."
      >
        <FormField
          label="Lecturer"
          description="Only active lecturers are shown."
          error={errors.lecturerId?.message}
          required
          htmlFor="lecturerId"
        >
          <Select
            value={selectedLecturerId || ""}
            onValueChange={(value) => {
              setValue("lecturerId", value, { shouldValidate: true });
            }}
          >
            <SelectTrigger id="lecturerId">
              <SelectValue placeholder="Select a lecturer" />
            </SelectTrigger>
            <SelectContent>
              {lecturers.map((lecturer) => (
                <SelectItem key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <FormSection
        title="Cover image"
        description="An optional cover image shown on the course page and cards."
      >
        <CloudinaryUploader
          value={coverAssets}
          onChange={(assets) => setCoverAssets(assets.slice(0, 1))}
          folder={CLOUDINARY_FOLDERS.COURSE_COVERS}
          accept="image/*"
          multiple={false}
          maxFiles={1}
        />
      </FormSection>

      <FormSection
        title="Description"
        description="A short summary shown to students."
      >
        <FormField
          label="Description"
          error={errors.description?.message}
          required
          htmlFor="description"
        >
          <Textarea
            id="description"
            placeholder="What will students learn in this course?"
            rows={5}
            {...register("description")}
          />
        </FormField>
      </FormSection>

      <FormActions
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </FormShell>
  );
}

CourseForm.displayName = "CourseForm";