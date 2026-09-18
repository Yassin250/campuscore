"use client";

import * as React from "react";
import { FileText, Image as ImageIcon, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileDropzone } from "./file-dropzone";
import {
  formatFileSize,
  getPreviewUrl,
  uploadToCloudinary,
  validateFile,
} from "@/lib/cloudinary";
import { notify } from "@/components/notifications/toast-helpers";
import { MAX_FILES_PER_UPLOAD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CloudinaryAsset } from "@/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CloudinaryUploaderProps = {
  /** Current list of uploaded assets (controlled). */
  value: CloudinaryAsset[];
  /** Called when the list changes (upload succeeds or item removed). */
  onChange: (assets: CloudinaryAsset[]) => void;
  /** Cloudinary folder, e.g. "campuscore/courses" */
  folder?: string;
  /** Accept attribute for the file input. Default: images + documents */
  accept?: string;
  /** Allow selecting more than one file. Default: true */
  multiple?: boolean;
  /** Max files allowed in the value array. Default: 5 */
  maxFiles?: number;
  /** Disable interactions */
  disabled?: boolean;
  /** Optional label above the dropzone */
  label?: string;
  /** Optional helper text below the dropzone */
  hint?: string;
  className?: string;
};

type UploadingItem = {
  id: string;
  name: string;
  progress: number;
  previewUrl?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CloudinaryUploader({
  value,
  onChange,
  folder,
  accept,
  multiple = true,
  maxFiles = MAX_FILES_PER_UPLOAD,
  disabled = false,
  label,
  hint,
  className,
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = React.useState<UploadingItem[]>([]);

  const remaining = maxFiles - value.length - uploading.length;
  const canUploadMore = remaining > 0 && !disabled;

  /* ---------------- upload handler ---------------- */

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    if (files.length > remaining) {
      notify.error(
        "Too many files",
        `You can upload ${remaining} more file${remaining === 1 ? "" : "s"}.`
      );
      files = files.slice(0, remaining);
    }

    // Add placeholders for each file we're about to upload
    const items: UploadingItem[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}-${Math.random()}`,
      name: file.name,
      progress: 0,
    }));
    setUploading((prev) => [...prev, ...items]);

    // Upload each file (parallel — replace with sequential if you prefer)
    const results = await Promise.all(
      files.map(async (file, index) => {
        const item = items[index];

        const validationError = validateFile(file);
        if (validationError) {
          notify.error(file.name, validationError);
          return null;
        }

        try {
          const asset = await uploadToCloudinary(file, {
            folder,
            onProgress: (percent) => {
              setUploading((prev) =>
                prev.map((u) =>
                  u.id === item.id ? { ...u, progress: percent } : u
                )
              );
            },
          });
          return asset;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Upload failed";
          notify.error(file.name, message);
          return null;
        }
      })
    );

    // Clear placeholders for this batch
    setUploading((prev) =>
      prev.filter((u) => !items.some((item) => item.id === u.id))
    );

    // Add the successful uploads
    const successes = results.filter(
      (r): r is CloudinaryAsset => r !== null
    );
    if (successes.length > 0) {
      onChange([...value, ...successes]);
      notify.success(
        successes.length === 1
          ? "File uploaded"
          : `${successes.length} files uploaded`
      );
    }
  };

  /* ---------------- remove handler ---------------- */

  const handleRemove = (asset: CloudinaryAsset, index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  /* ---------------- render ---------------- */

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{label}</p>
          {hint && (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
      )}

      {/* Dropzone — hidden when at max files */}
      {canUploadMore && (
        <FileDropzone
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onFiles={handleFiles}
        />
      )}

      {/* Uploading placeholders */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((item) => (
            <UploadingRow key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Preview grid of uploaded assets */}
      {value.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {value.map((asset, index) => (
            <AssetCard
              key={asset.publicId}
              asset={asset}
              onRemove={() => handleRemove(asset, index)}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {maxFiles > 1 && (
        <p className="text-xs text-muted-foreground">
          {value.length} of {maxFiles} file
          {maxFiles === 1 ? "" : "s"} uploaded
        </p>
      )}
    </div>
  );
}

CloudinaryUploader.displayName = "CloudinaryUploader";

/* ------------------------------------------------------------------ */
/*  Uploading row (during upload)                                      */
/* ------------------------------------------------------------------ */

function UploadingRow({ item }: { item: UploadingItem }) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        <span className="truncate font-medium">{item.name}</span>
        <span className="ml-auto shrink-0 tabular-nums text-muted-foreground">
          {item.progress}%
        </span>
      </div>
      <Progress value={item.progress} className="h-1.5" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset card (uploaded asset preview)                                */
/* ------------------------------------------------------------------ */

function AssetCard({
  asset,
  onRemove,
  disabled,
}: {
  asset: CloudinaryAsset;
  onRemove: () => void;
  disabled: boolean;
}) {
  const isImage = asset.type === "image";

  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-lg border bg-card p-3">
      {/* Preview */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPreviewUrl(asset)}
            alt={asset.name ?? "Uploaded image"}
            className="h-full w-full object-cover"
          />
        ) : asset.type === "video" ? (
          <FileText className="h-5 w-5 text-muted-foreground" />
        ) : (
          <FileText className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {asset.name ?? "Untitled"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isImage ? "Image" : asset.type === "video" ? "Video" : "Document"}
          {asset.size ? ` · ${formatFileSize(asset.size)}` : ""}
        </p>
      </div>

      {/* Remove button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        className={cn(
          "h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive",
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
          "transition-opacity"
        )}
        aria-label={`Remove ${asset.name ?? "file"}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}