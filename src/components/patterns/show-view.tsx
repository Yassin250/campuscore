import { ViewShell } from "./view-shell";
import { ViewHeader } from "./view-header";
import type { BreadcrumbItemDef } from "./page-breadcrumb";

type ShowViewProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemDef[];
  /** Actions — typically Edit + Refresh buttons */
  actions?: React.ReactNode;
  /** Where the back arrow goes. Default: browser history. */
  backHref?: string;
  /** Hide the back arrow. Default true (show it). */
  showBack?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function ShowView({
  title,
  description,
  breadcrumbs,
  actions,
  backHref,
  showBack = true,
  children,
  className,
}: ShowViewProps) {
  return (
    <ViewShell className={className}>
      <ViewHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        showBack={showBack}
        backHref={backHref}
        actions={actions}
      />
      {children}
    </ViewShell>
  );
}

ShowView.displayName = "ShowView";