"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageBreadcrumb,
  type BreadcrumbItemDef,
} from "./page-breadcrumb";
import { cn } from "@/lib/utils";

type ViewHeaderProps = {
  title: string;
  description?: string;
  /** Breadcrumb trail above the title */
  breadcrumbs?: BreadcrumbItemDef[];
  /** Show a back arrow to the left of the title. Default false. */
  showBack?: boolean;
  /**
   * Where the back button goes. If provided, back is a direct link.
   * If omitted, uses browser history.
   */
  backHref?: string;
  /** Right-aligned actions — buttons, dropdowns, etc. */
  actions?: React.ReactNode;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the title + actions row */
  headerClassName?: string;
};

export function ViewHeader({
  title,
  description,
  breadcrumbs,
  showBack = false,
  backHref,
  actions,
  className,
  headerClassName,
}: ViewHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <PageBreadcrumb items={breadcrumbs} />
      )}

      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
          headerClassName
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="-ml-2 mt-0.5 h-8 w-8 shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="min-w-0 space-y-1">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

ViewHeader.displayName = "ViewHeader";