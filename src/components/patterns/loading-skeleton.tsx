import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Small primitives                                                   */
/* ------------------------------------------------------------------ */

type SkeletonProps = {
  className?: string;
};

/** Renders a row of N stat cards. Used on dashboards. */
export function StatCardsSkeleton({
  count = 4,
  className,
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** One stat card placeholder — label + value. */
export function StatCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-16" />
    </div>
  );
}

/** Header placeholder — title + optional description. */
export function PageHeaderSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

/** Table skeleton — header row + N body rows + M columns. */
export function TableSkeleton({
  rows = 8,
  columns = 5,
  className,
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      {/* header */}
      <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* body rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Vertical list of item rows. Used on announcements, submissions. */
export function ListSkeleton({
  count = 5,
  showAvatar = true,
  className,
}: SkeletonProps & { count?: number; showAvatar?: boolean }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          {showAvatar && <Skeleton className="h-10 w-10 shrink-0 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Grid of card-shaped placeholders. Used for courses, faculty. */
export function CardGridSkeleton({
  count = 6,
  className,
}: SkeletonProps & { count?: number }) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border bg-card"
        >
          {/* banner / cover */}
          <Skeleton className="h-32 w-full rounded-none" />
          {/* body */}
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Matches `UserInfo` — avatar + two lines. */
export function UserInfoSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-44" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composite — full page                                              */
/* ------------------------------------------------------------------ */

type PageSkeletonProps = {
  /** Show stat cards row under the header. Default false. */
  withStats?: boolean;
  /** Content shape. Default "list". */
  variant?: "list" | "table" | "grid";
  className?: string;
};

/** A full-page loading state. Header + optional stats + content. */
export function PageSkeleton({
  withStats = false,
  variant = "list",
  className,
}: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <PageHeaderSkeleton />

      {withStats && <StatCardsSkeleton />}

      {variant === "list" && <ListSkeleton />}
      {variant === "table" && <TableSkeleton />}
      {variant === "grid" && <CardGridSkeleton />}
    </div>
  );
}