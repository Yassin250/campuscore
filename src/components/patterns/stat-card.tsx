import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Trend = {
  /** Percent change, e.g. 12 for +12%, -5 for -5% */
  value: number;
  /** "up" (green) or "down" (red). Default inferred from `value`. */
  direction?: "up" | "down";
  /** Text after the percentage, e.g. "from last month" */
  label?: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  /** Optional icon in the corner */
  icon?: LucideIcon;
  /** Optional trend indicator below the value */
  trend?: Trend;
  /** Optional sub-text below the value (mutually exclusive with trend, trend wins) */
  hint?: string;
  /** Wrap in a link to make the whole card clickable */
  href?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  href,
  className,
}: StatCardProps) {
  const card = (
    <Card
      className={cn(
        "transition-colors",
        href && "hover:border-primary/40 hover:bg-accent/40",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            {trend ? (
              <TrendLine trend={trend} />
            ) : hint ? (
              <p className="truncate text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </div>

          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {card}
      </Link>
    );
  }

  return card;
}

function TrendLine({ trend }: { trend: Trend }) {
  const direction = trend.direction ?? (trend.value >= 0 ? "up" : "down");
  const isUp = direction === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-1 text-xs">
      <Icon
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          isUp
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "font-medium",
          isUp
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        )}
      >
        {Math.abs(trend.value)}%
      </span>
      {trend.label && (
        <span className="truncate text-muted-foreground">{trend.label}</span>
      )}
    </div>
  );
}

StatCard.displayName = "StatCard";