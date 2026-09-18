"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  /** The visible field label */
  label?: string;
  /** Help text shown below the label (hidden when error is present) */
  description?: string;
  /** Validation error message from the form state */
  error?: string;
  /** Mark the label with an asterisk */
  required?: boolean;
  /** The `id` of the input this label points to */
  htmlFor?: string;
  /** The input, textarea, select, etc. */
  children: React.ReactNode;
  /** Extra classes on the wrapper */
  className?: string;
};

export function FormField({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium",
            error && "text-destructive"
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      {children}

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

FormField.displayName = "FormField";