import { toast } from "sonner";
import { UndoableToast } from "./undoable-toast";
import { createElement } from "react";

/* ------------------------------------------------------------------ */
/*  Simple helpers — thin wrappers over sonner                         */
/* ------------------------------------------------------------------ */

export const notify = {
  success(message: string, description?: string) {
    toast.success(message, { description });
  },

  error(message: string, description?: string) {
    toast.error(message, { description });
  },

  info(message: string, description?: string) {
    toast.info(message, { description });
  },

  warning(message: string, description?: string) {
    toast.warning(message, { description });
  },

  /** Plain message — no icon, no color. */
  message(message: string, description?: string) {
    toast(message, { description });
  },

  /** Promise helper: shows loading → success/error automatically. */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) {
    return toast.promise(promise, messages);
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Undoable toast — for destructive actions                           */
/* ------------------------------------------------------------------ */

type UndoableOptions = {
  message: string;
  description?: string;
  /** Seconds before auto-dismiss (default 5) */
  undoableTimeout?: number;
  /** Action to run when Undo is clicked (reverts the operation) */
  onUndo: () => void;
};

/**
 * Show a toast with an Undo button. The toast auto-dismisses after
 * `undoableTimeout` seconds; if the user clicks Undo before then, the
 * `onUndo` callback fires and the toast closes immediately.
 *
 * Usage:
 *   notifyUndoable({
 *     message: "Course deleted",
 *     description: "CS101 — Intro to Programming",
 *     onUndo: () => restoreCourse(course.id),
 *   });
 */
export function notifyUndoable({
  message,
  description,
  undoableTimeout = 5,
  onUndo,
}: UndoableOptions) {
  const id = `undo-${Date.now()}`;

  toast(
    createElement(UndoableToast, {
      message,
      description,
      undoableTimeout,
      onUndo,
      onClose: () => toast.dismiss(id),
    }),
    {
      id,
      duration: undoableTimeout * 1000,
      unstyled: true,
    }
  );

  return id;
}