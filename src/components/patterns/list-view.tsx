import { ViewShell } from "./view-shell";
import { ViewHeader } from "./view-header";
import type { BreadcrumbItemDef } from "./page-breadcrumb";

type ListViewProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemDef[];
  /** Actions on the right — e.g., "Create course" button */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ListView({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className,
}: ListViewProps) {
  return (
    <ViewShell className={className}>
      <ViewHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      {children}
    </ViewShell>
  );
}

ListView.displayName = "ListView";