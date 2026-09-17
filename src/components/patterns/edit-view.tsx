import { ViewShell } from "./view-shell";
import { ViewHeader } from "./view-header";
import type { BreadcrumbItemDef } from "./page-breadcrumb";

type EditViewProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemDef[];
  backHref?: string;
  /** Actions — usually Save + Refresh + Delete */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function EditView({
  title,
  description,
  breadcrumbs,
  backHref,
  actions,
  children,
  className,
}: EditViewProps) {
  return (
    <ViewShell className={className}>
      <ViewHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        showBack
        backHref={backHref}
        actions={actions}
      />
      {children}
    </ViewShell>
  );
}

EditView.displayName = "EditView";