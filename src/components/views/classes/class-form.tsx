"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Plus, RefreshCw, Trash2 } from "lucide-react";

import {
  FormActions,
  FormField,
  FormSection,
  FormShell,
} from "@/components/patterns/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUploader } from "@/components/uploads/cloudinary-uploader";
import { notify } from "@/components/notifications/toast-helpers";
import { courses, users } from "@/lib/mock";
import {
  CLOUDINARY_FOLDERS,
  CLASS_CAPACITY_MAX,
  CLASS_CAPACITY_MIN,
  CLASS_SCHEDULE_MAX,
} from "@/lib/constants";
import { formatJoinCode, generateJoinCode } from "@/lib/joinCode";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { CloudinaryAsset, ClassDetails } from "@/types";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const DAY_OPTIONS = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
] as const;

const scheduleSchema = z.object({
  day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  room: z.string().max(40, "Room must be at most 40 characters").optional(),
});

const classSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  courseId: z
    .number({ message: "Please select a course" })
    .int()
    .positive("Please select a course"),
  lecturerId: z.string().min(1, "Please select a lecturer"),
  capacity: z
    .number({ message: "Capacity is required" })
    .int()
    .min(CLASS_CAPACITY_MIN, `At least ${CLASS_CAPACITY_MIN}`)
    .max(CLASS_CAPACITY_MAX, `At most ${CLASS_CAPACITY_MAX}`),
  status: z.enum(["active", "inactive", "archived"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  schedules: z
    .array(scheduleSchema)
    .min(1, "At least one schedule is required")
    .max(CLASS_SCHEDULE_MAX, `At most ${CLASS_SCHEDULE_MAX} schedules`),
});

export type ClassFormValues = z.infer<typeof classSchema>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type ClassFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ClassDetails>;
  onSubmit: (
    values: ClassFormValues,
    banner: CloudinaryAsset | null,
    joinCode: string
  ) => Promise<void> | void;
};

export function ClassForm({
  mode,
  defaultValues,
  onSubmit,
}: ClassFormProps) {
  const router = useRouter();
  const mounted = useMounted();

  /* ---------------- banner state ---------------- */

  const [bannerAssets, setBannerAssets] = useState<CloudinaryAsset[]>(
    defaultValues?.bannerUrl
      ? [
          {
            url: defaultValues.bannerUrl,
            publicId: defaultValues.bannerCldPubId ?? "",
            type: "image",
          },
        ]
      : []
  );

  /* ---------------- join code state ---------------- */

  // Start empty on both server and client so hydration matches.
  // Fill in on mount (create mode) or from defaultValues (edit mode).
  const [joinCode, setJoinCode] = useState<string>(
    mode === "edit" && defaultValues?.joinCode ? defaultValues.joinCode : ""
  );

  useEffect(() => {
    if (mode === "create" && mounted && !joinCode) {
      setJoinCode(generateJoinCode());
    }
  }, [mode, mounted, joinCode]);

  /* ---------------- dropdown options ---------------- */

  const courseOptions = useMemo(
    () =>
      [...courses]
        .sort((a, b) =>
          `${a.code} ${a.name}`.localeCompare(`${b.code} ${b.name}`)
        )
        .map((c) => ({
          value: String(c.id),
          label: `${c.code} — ${c.name}`,
        })),
    []
  );

  const lecturerOptions = useMemo(
    () =>
      users
        .filter((u) => u.role === "LECTURER" && u.active !== false)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((u) => ({ value: u.id, label: u.name })),
    []
  );

  /* ---------------- form ---------------- */

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      courseId: defaultValues?.courseId ?? 0,
      lecturerId: defaultValues?.lecturerId ?? "",
      capacity: defaultValues?.capacity ?? 30,
      status: defaultValues?.status ?? "active",
      description: defaultValues?.description ?? "",
      schedules:
        defaultValues?.schedules && defaultValues.schedules.length > 0
          ? defaultValues.schedules
          : [{ day: "Mon", startTime: "09:00", endTime: "10:30", room: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const selectedCourseId = watch("courseId");
  const selectedLecturerId = watch("lecturerId");
  const selectedStatus = watch("status");

  /* ---------------- handlers ---------------- */

  const handleCancel = () => router.back();

  const handleRegenerate = () => {
    setJoinCode(generateJoinCode());
    notify.info("New code generated", "The old code won't work anymore.");
  };

  const handleCopyCode = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      notify.success("Copied", "Join code copied to clipboard.");
    } catch {
      notify.error("Copy failed", "Copy manually: " + joinCode);
    }
  };

  const handleAddSlot = () => {
    if (fields.length >= CLASS_SCHEDULE_MAX) {
      notify.error(
        "Limit reached",
        `You can add up to ${CLASS_SCHEDULE_MAX} schedule slots.`
      );
      return;
    }
    append({ day: "Mon", startTime: "09:00", endTime: "10:30", room: "" });
  };

  const submitLabel = mode === "create" ? "Create class" : "Save changes";
  const submittingLabel = mode === "create" ? "Creating..." : "Saving...";

  const handleFormSubmit = async (values: ClassFormValues) => {
    await onSubmit(values, bannerAssets[0] ?? null, joinCode);
  };

  const schedulesError =
    typeof errors.schedules?.message === "string"
      ? errors.schedules.message
      : undefined;

  return (
    <FormShell onSubmit={handleSubmit(handleFormSubmit)}>
      {/* ================= BASIC ================= */}

      <FormSection
        title="Basic information"
        description="The class name, parent course, and capacity."
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
              placeholder="Introduction to Programming — Section A"
              autoComplete="off"
              autoFocus={mode === "create"}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Capacity"
            error={errors.capacity?.message}
            required
            htmlFor="capacity"
          >
            <Input
              id="capacity"
              type="number"
              min={CLASS_CAPACITY_MIN}
              max={CLASS_CAPACITY_MAX}
              {...register("capacity", { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <FormField
          label="Course"
          description="The course this class is a section of."
          error={errors.courseId?.message}
          required
          htmlFor="courseId"
        >
          <Select
            value={selectedCourseId ? String(selectedCourseId) : ""}
            onValueChange={(value) => {
              setValue("courseId", Number(value), { shouldValidate: true });
            }}
          >
            <SelectTrigger id="courseId">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

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
              {lecturerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Status"
          error={errors.status?.message}
          required
          htmlFor="status"
        >
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setValue(
                "status",
                value as "active" | "inactive" | "archived",
                { shouldValidate: true }
              );
            }}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      {/* ================= BANNER ================= */}

      <FormSection
        title="Banner image"
        description="An optional banner shown on the class page."
      >
        <CloudinaryUploader
          value={bannerAssets}
          onChange={(assets) => setBannerAssets(assets.slice(0, 1))}
          folder={CLOUDINARY_FOLDERS.CLASS_BANNERS}
          accept="image/*"
          multiple={false}
          maxFiles={1}
        />
      </FormSection>

      {/* ================= SCHEDULES ================= */}

      <FormSection
        title="Schedule"
        description={`When this class meets. Up to ${CLASS_SCHEDULE_MAX} slots.`}
      >
        <div className="space-y-3">
          {fields.map((field, index) => (
            <ScheduleRow
              key={field.id}
              index={index}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
              register={register}
              errors={errors}
            />
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSlot}
              disabled={fields.length >= CLASS_SCHEDULE_MAX}
            >
              <Plus className="h-4 w-4" />
              Add slot
            </Button>

            {schedulesError && (
              <p className="text-xs text-destructive" role="alert">
                {schedulesError}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* ================= DESCRIPTION ================= */}

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
            placeholder="What happens in this class?"
            rows={4}
            {...register("description")}
          />
        </FormField>
      </FormSection>

      {/* ================= JOIN CODE ================= */}

      <FormSection
        title="Join code"
        description="Students use this code to enroll in the class."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <Badge
            variant="outline"
            className="font-mono text-base tracking-wider"
          >
            {joinCode ? formatJoinCode(joinCode) : "••••-••••"}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              disabled={!joinCode}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              disabled={!joinCode}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>
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

ClassForm.displayName = "ClassForm";

/* ------------------------------------------------------------------ */
/*  Schedule row                                                       */
/* ------------------------------------------------------------------ */

function ScheduleRow({
  index,
  canRemove,
  onRemove,
  register,
  errors,
}: {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  register: ReturnType<typeof useForm<ClassFormValues>>["register"];
  errors: ReturnType<
    typeof useForm<ClassFormValues>
  >["formState"]["errors"];
}) {
  const rowErrors = errors.schedules?.[index];

  return (
    <div
      className={cn(
        "grid gap-3 rounded-lg border bg-card p-3",
        "grid-cols-2 sm:grid-cols-[140px_1fr_1fr_1fr_auto]"
      )}
    >
      {/* Day */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Day</label>
        <select
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
          {...register(`schedules.${index}.day`)}
        >
          {DAY_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Start time */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Start</label>
        <Input type="time" {...register(`schedules.${index}.startTime`)} />
      </div>

      {/* End time */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">End</label>
        <Input type="time" {...register(`schedules.${index}.endTime`)} />
      </div>

      {/* Room */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          Room <span className="opacity-60">(optional)</span>
        </label>
        <Input placeholder="B-201" {...register(`schedules.${index}.room`)} />
      </div>

      {/* Remove */}
      <div className="flex items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="h-9 w-9 text-muted-foreground hover:text-destructive"
          aria-label="Remove this schedule"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Row-level errors */}
      {rowErrors && (
        <div className="col-span-full text-xs text-destructive" role="alert">
          {rowErrors.startTime?.message ||
            rowErrors.endTime?.message ||
            rowErrors.room?.message}
        </div>
      )}
    </div>
  );
}