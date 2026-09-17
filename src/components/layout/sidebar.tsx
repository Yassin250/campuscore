"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/layout/user-avatar";
import { RoleBadge } from "@/components/patterns/role-badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getNavForRole, type NavItem, type NavSection } from "@/lib/nav";
import { APP_LOGO, APP_NAME } from "@/lib/brand";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const user = useCurrentUser();
  const sections = getNavForRole(user.role);

  return (
    <ShadcnSidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <NavSectionGroup
            key={section.title ?? "main"}
            section={section}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserCard />
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  );
}

/* ------------------------------------------------------------------ */
/*  Header — logo + brand + desktop trigger                            */
/* ------------------------------------------------------------------ */

function SidebarBrand() {
  const { open, isMobile } = useSidebar();
  const Logo = APP_LOGO;

  return (
    <div
      className={cn(
        "flex h-14 items-center gap-2 border-b border-sidebar-border px-3",
        !open && !isMobile && "justify-center px-0"
      )}
    >
      <Link
        href={ROUTES.DASHBOARD}
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-md outline-none",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        )}
        aria-label={APP_NAME}
      >
        <Logo className="h-6 w-6 shrink-0 text-primary" />
        {open && (
          <span className="truncate text-sm font-semibold tracking-tight">
            {APP_NAME}
          </span>
        )}
      </Link>

      {!isMobile && open && (
        <SidebarTrigger className="ml-auto -mr-1 text-muted-foreground" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  A section of nav items                                             */
/* ------------------------------------------------------------------ */

function NavSectionGroup({ section }: { section: NavSection }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {section.title && (
        <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {section.title}
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {section.items.map((item) => (
          <NavMenuItem
            key={item.href}
            item={item}
            isActive={isItemActive(item, pathname)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/* ------------------------------------------------------------------ */
/*  One nav item                                                       */
/* ------------------------------------------------------------------ */

function NavMenuItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        className={cn(
          "h-9 gap-2.5",
          isActive && "font-semibold"
        )}
      >
        <Link href={item.href}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer — user card                                                 */
/* ------------------------------------------------------------------ */

function SidebarUserCard() {
  const user = useCurrentUser();
  const { open, isMobile } = useSidebar();

  // Collapsed mode: show just the avatar
  if (!open && !isMobile) {
    return (
      <div className="flex justify-center py-2">
        <UserAvatar name={user.name} image={user.image} className="h-8 w-8" />
      </div>
    );
  }

  // Expanded: full user info
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors">
      <UserAvatar name={user.name} image={user.image} className="h-9 w-9" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium leading-none">
          {user.name}
        </span>
        <span className="truncate text-xs text-muted-foreground leading-none">
          {user.email}
        </span>
      </div>
      <RoleBadge role={user.role} compact />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Active-route detection                                             */
/* ------------------------------------------------------------------ */

function isItemActive(item: NavItem, pathname: string): boolean {
  // Exact match needed for root-level routes to avoid always-true prefixes
  if (item.exact || item.href === "/") {
    return pathname === item.href;
  }

  // Nested routes: /courses/123 matches /courses
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

Sidebar.displayName = "Sidebar";