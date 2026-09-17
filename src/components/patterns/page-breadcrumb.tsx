import Link from "next/link";
import { Fragment } from "react";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type BreadcrumbItemDef = {
  label: string;
  /** Omit `href` for the current page — it renders as plain text. */
  href?: string;
};

type PageBreadcrumbProps = {
  /**
   * Trail items **after** the home icon.
   * The last item is automatically rendered as the current page
   * (non-clickable) even if it has an `href`.
   */
  items: BreadcrumbItemDef[];
  /** Show a home icon as the first crumb (default true). */
  showHome?: boolean;
  /** Override where the home icon links to (default /dashboard). */
  homeHref?: string;
  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PageBreadcrumb({
  items,
  showHome = true,
  homeHref = ROUTES.DASHBOARD,
  className,
}: PageBreadcrumbProps) {
  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={homeHref} aria-label="Home">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

PageBreadcrumb.displayName = "PageBreadcrumb";