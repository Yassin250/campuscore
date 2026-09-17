import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EmptyStateProps = {
  /** Icon shown above the title. Defaults to a generic inbox. */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional action area — a Button, a Link, or a group of both. */
  action?: React.ReactNode;
  /** Compact variant for use inside tables or narrow containers. */
  variant?: "default" | "compact";
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "gap-2 p-6" : "gap-3 p-12",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted",
          isCompact ? "h-10 w-10" : "h-14 w-14"
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            isCompact ? "h-5 w-5" : "h-7 w-7"
          )}
          aria-hidden="true"
        />
      </div>

      <div className={cn("space-y-1", !isCompact && "space-y-1.5")}>
        <h3
          className={cn(
            "font-semibold text-foreground",
            isCompact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "text-muted-foreground",
              isCompact ? "max-w-xs text-xs" : "max-w-sm text-sm"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className={cn(isCompact ? "pt-1" : "pt-3")}>{action}</div>}
    </div>
  );
}

EmptyState.displayName = "EmptyState";