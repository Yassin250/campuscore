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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments } from "@/lib/mock";
import type { User } from "@/types";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const facultySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z.string().email("Enter a valid email address"),
  departmentId: z
    .number({ message: "Please select a department" })
    .int()
    .positive("Please select a department"),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  active: z.boolean(),
});

export type FacultyFormValues = z.infer<typeof facultySchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type FacultyFormProps = {
  defaultValues?: Partial<User>;
  onSubmit: (values: FacultyFormValues) => Promise<void> | void;
};

export function FacultyForm({ defaultValues, onSubmit }: FacultyFormProps) {
  const router = useRouter();

  // Sorted alphabetically for the dropdown
  const sortedDepartments = useMemo(
    () => [...departments].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      departmentId: defaultValues?.departmentId ?? 0,
      bio: defaultValues?.bio ?? "",
      active: defaultValues?.active ?? true,
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
  const isActive = watch("active");

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)}>
      <FormSection
        title="Basic information"
        description="The lecturer's name, email, and department."
      >
        <FormField
          label="Name"
          error={errors.name?.message}
          required
          htmlFor="name"
        >
          <Input
            id="name"
            placeholder="Ada Lovelace"
            autoComplete="off"
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Email"
          description="Used for sign-in and notifications."
          error={errors.email?.message}
          required
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            placeholder="ada@campuscore.dev"
            autoComplete="off"
            {...register("email")}
          />
        </FormField>

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
      </FormSection>

      <FormSection
        title="Profile"
        description="Public information shown on the lecturer's profile page."
      >
        <FormField
          label="Bio"
          description="A short biography. Max 500 characters."
          error={errors.bio?.message}
          htmlFor="bio"
        >
          <Textarea
            id="bio"
            placeholder="Teaching programming fundamentals..."
            rows={5}
            maxLength={500}
            {...register("bio")}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Account status"
        description="Inactive lecturers keep their data but can't sign in or access their classes."
      >
        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
          <div className="space-y-0.5">
            <label
              htmlFor="active"
              className="text-sm font-medium leading-none"
            >
              Active
            </label>
            <p className="text-xs text-muted-foreground">
              {isActive
                ? "This lecturer can sign in and access their classes."
                : "This lecturer is suspended and can't sign in."}
            </p>
          </div>
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={(checked) => setValue("active", checked)}
          />
        </div>
      </FormSection>

      <FormActions
        submitLabel="Save changes"
        submittingLabel="Saving..."
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </FormShell>
  );
}

FacultyForm.displayName = "FacultyForm";