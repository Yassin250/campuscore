import { ViewShell } from "./view-shell";
import { ViewHeader } from "./view-header";
import type { BreadcrumbItemDef } from "./page-breadcrumb";

type CreateViewProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemDef[];
  /** Where the back arrow goes. Typically the list page. */
  backHref?: string;
  /** Actions slot — usually nothing, form has its own save button */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function CreateView({
  title,
  description,
  breadcrumbs,
  backHref,
  actions,
  children,
  className,
}: CreateViewProps) {
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

CreateView.displayName = "CreateView";