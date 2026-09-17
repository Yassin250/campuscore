"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ConfirmDialogProps = {
  /** Element that opens the dialog when clicked. */
  trigger: React.ReactNode;
  title: string;
  description?: string;
  /** Text on the confirm button. Default "Confirm". */
  confirmLabel?: string;
  /** Text on the cancel button. Default "Cancel". */
  cancelLabel?: string;
  /**
   * Visual style of the confirm button.
   * - "default" → primary color (for non-destructive actions)
   * - "destructive" → red (for delete / remove / archive)
   */
  variant?: "default" | "destructive";
  /**
   * Called when confirm is clicked. If it returns a Promise, the button
   * shows a spinner and stays disabled until it resolves.
   */
  onConfirm: () => void | Promise<void>;
  /** Optional extra classes on the content. */
  className?: string;
  /** Optional test hook / analytics id. */
  actionId?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  onConfirm,
  className,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              buttonVariants({ variant }),
              "gap-2"
            )}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Please wait…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

ConfirmDialog.displayName = "ConfirmDialog";