"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormActionsProps = {
  /** Label for the submit button */
  submitLabel?: string;
  /** Label shown while submitting */
  submittingLabel?: string;
  /** Cancel button label. Default "Cancel". Pass `null` to hide. */
  cancelLabel?: string | null;
  /** Called when Cancel is clicked. If omitted, Cancel renders without a handler. */
  onCancel?: () => void;
  /** Is the form currently submitting? */
  isSubmitting?: boolean;
  /** Disable the submit button for reasons other than submitting */
  disabled?: boolean;
  className?: string;
};

export function FormActions({
  submitLabel = "Save",
  submittingLabel = "Saving...",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  disabled = false,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
    >
      {cancelLabel !== null && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting || disabled}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}

FormActions.displayName = "FormActions";