"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UndoableToastProps = {
  message: string;
  description?: string;
  /** Seconds before the toast auto-dismisses (default 5) */
  undoableTimeout?: number;
  /** Called when the user clicks Undo — should reverse the action */
  onUndo?: () => void;
  /** Called when the toast closes by any means (undo or timeout) */
  onClose?: () => void;
};

export function UndoableToast({
  message,
  description,
  undoableTimeout = 5,
  onUndo,
  onClose,
}: UndoableToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, undoableTimeout * 1000);

    return () => clearTimeout(timer);
  }, [onClose, undoableTimeout]);

  const handleUndo = () => {
    onUndo?.();
    onClose?.();
  };

  return (
    <div
      className={cn(
        "min-w-[320px] max-w-md rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xl"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-foreground">{message}</div>
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={handleUndo}>
          Undo
        </Button>
      </div>
    </div>
  );
}

UndoableToast.displayName = "UndoableToast";