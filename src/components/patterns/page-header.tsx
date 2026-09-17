import { cn } from "@/lib/utils";
import { PageBreadcrumb, type BreadcrumbItemDef } from "./page-breadcrumb";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Optional breadcrumb trail. Omit to hide the breadcrumb. */
  breadcrumbs?: BreadcrumbItemDef[];
  /** Right-aligned actions — buttons, links, dropdowns. */
  actions?: React.ReactNode;
  /** Extra classes on the outer wrapper. */
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <PageBreadcrumb items={breadcrumbs} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

PageHeader.displayName = "PageHeader";