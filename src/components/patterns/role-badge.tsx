import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types";

/* ------------------------------------------------------------------ */
/*  Per-role styling                                                   */
/* ------------------------------------------------------------------ */

const ROLE_STYLES: Record<Role, string> = {
  SUPER_ADMIN:
    "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  ADMIN:
    "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  LECTURER:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  STUDENT:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type RoleBadgeProps = {
  role: Role;
  /** Hide the label — render only the first letter or a dot */
  compact?: boolean;
  className?: string;
};

export function RoleBadge({ role, compact = false, className }: RoleBadgeProps) {
  const label = ROLE_LABELS[role];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        ROLE_STYLES[role],
        compact && "px-1.5 text-[10px]",
        className
      )}
      aria-label={`Role: ${label}`}
    >
      {compact ? label.charAt(0) : label}
    </Badge>
  );
}

RoleBadge.displayName = "RoleBadge";