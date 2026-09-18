"use client";

import { useMemo } from "react";
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
import { departments } from "@/lib/mock";
import type { Subject } from "@/types";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const subjectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name must be at most 80 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be at most 10 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  departmentId: z
    .number({ message: "Please select a department" })
    .int()
    .positive("Please select a department"),
  credits: z
    .number({ message: "Credits must be a number" })
    .int("Credits must be a whole number")
    .min(1, "At least 1 credit")
    .max(6, "At most 6 credits"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type SubjectFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<Subject>;
  onSubmit: (values: SubjectFormValues) => Promise<void> | void;
};

export function SubjectForm({
  mode,
  defaultValues,
  onSubmit,
}: SubjectFormProps) {
  const router = useRouter();

  // Sorted alphabetically for the dropdown
  const sortedDepartments = useMemo(
    () => [...departments].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      departmentId: defaultValues?.departmentId ?? 0,
      credits: defaultValues?.credits ?? 3,
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

  const selectedDepartmentId = watch("departmentId");

  const handleCancel = () => {
    router.back();
  };

  const submitLabel =
    mode === "create" ? "Create subject" : "Save changes";
  const submittingLabel =
    mode === "create" ? "Creating..." : "Saving...";

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Basic information"
        description="The subject name, short code, and parent department."
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
              placeholder="Introduction to Computer Science"
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

        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <FormField
            label="Department"
            error={errors.departmentId?.message}
            required
            htmlFor="departmentId"
          >
            <Select
              value={selectedDepartmentId ? String(selectedDepartmentId) : ""}
              onValueChange={(value) => {
                setValue("departmentId", Number(value), {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger id="departmentId">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {sortedDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Credits"
            error={errors.credits?.message}
            required
            htmlFor="credits"
          >
            <Input
              id="credits"
              type="number"
              min={1}
              max={6}
              {...register("credits", { valueAsNumber: true })}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Details"
        description="A short description shown on the subject page."
      >
        <FormField
          label="Description"
          error={errors.description?.message}
          required
          htmlFor="description"
        >
          <Textarea
            id="description"
            placeholder="Topics covered, prerequisites, or a general summary..."
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

SubjectForm.displayName = "SubjectForm";