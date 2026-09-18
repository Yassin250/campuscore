"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FileDropzoneProps = {
  /** Accept attribute for the file input, e.g. "image/*" */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Disable interactions */
  disabled?: boolean;
  /** Called with selected/dropped files */
  onFiles: (files: File[]) => void;
  /** Content shown inside the dropzone. Defaults to icon + text. */
  children?: React.ReactNode;
  /** Extra classes on the dropzone container */
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FileDropzone({
  accept,
  multiple = false,
  disabled = false,
  onFiles,
  children,
  className,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const openFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onFiles(Array.from(files));
    // Reset so picking the same file again works
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    onFiles(Array.from(files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openFilePicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFilePicker();
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center outline-none transition-colors",
        "hover:border-primary/60 hover:bg-accent/40",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragging && "border-primary bg-accent/60",
        disabled && "cursor-not-allowed opacity-60 hover:border-border hover:bg-transparent",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />

      {children ?? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
            <UploadCloud
              className={cn(
                "h-6 w-6 text-muted-foreground transition-colors",
                isDragging && "text-primary",
                !isDragging && "group-hover:text-primary"
              )}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragging
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept === "image/*"
                ? "PNG, JPG, WEBP"
                : accept
                  ? `Accepted: ${accept}`
                  : "Any file type"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

FileDropzone.displayName = "FileDropzone";