"use client";

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
import type { Department } from "@/types";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const departmentSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name must be at most 80 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be at most 10 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type DepartmentFormProps = {
  /** "create" shows the create labels, "edit" shows the edit labels */
  mode: "create" | "edit";
  /** Pre-filled values (edit mode) */
  defaultValues?: Partial<Department>;
  /**
   * Called when the form is submitted with valid values.
   * Can be async — the submit button will show a spinner until it resolves.
   */
  onSubmit: (values: DepartmentFormValues) => Promise<void> | void;
};

export function DepartmentForm({
  mode,
  defaultValues,
  onSubmit,
}: DepartmentFormProps) {
  const router = useRouter();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleCancel = () => {
    router.back();
  };

  const submitLabel =
    mode === "create" ? "Create department" : "Save changes";
  const submittingLabel =
    mode === "create" ? "Creating..." : "Saving...";

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Basic information"
        description="The department name and short code used across the platform."
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
              placeholder="Computer Science"
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
              placeholder="CS"
              autoComplete="off"
              className="uppercase"
              {...register("code")}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Details"
        description="A short description shown on the department page."
      >
        <FormField
          label="Description"
          error={errors.description?.message}
          required
          htmlFor="description"
        >
          <Textarea
            id="description"
            placeholder="Focus areas, research interests, or a general summary..."
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

DepartmentForm.displayName = "DepartmentForm";