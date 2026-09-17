"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserAvatar } from "@/components/layout/user-avatar";
import { UserInfo } from "@/components/layout/user-info";
import { RoleBadge } from "@/components/patterns/role-badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { APP_NAME } from "@/lib/brand";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function Header() {
  const { isMobile } = useSidebar();

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

/* ------------------------------------------------------------------ */
/*  Desktop — thin right-aligned bar                                   */
/* ------------------------------------------------------------------ */

function DesktopHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-2",
        "border-b border-border bg-background/95 px-4 backdrop-blur"
      )}
    >
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile — trigger + brand + actions                                 */
/* ------------------------------------------------------------------ */

function MobileHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2",
        "border-b border-border bg-background/95 px-3 backdrop-blur"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Link
          href={ROUTES.DASHBOARD}
          className="truncate text-sm font-semibold"
        >
          {APP_NAME}
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  User dropdown                                                      */
/* ------------------------------------------------------------------ */

function UserDropdown() {
  const user = useCurrentUser();

  const handleLogout = async () => {
    // NextAuth's signOut() — works the moment an AuthProvider is mounted.
    // Until then it's a no-op (the call itself is still valid).
    await signOut({ callbackUrl: ROUTES.LOGIN });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "rounded-full outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Open user menu"
        >
          <UserAvatar name={user.name} image={user.image} className="h-9 w-9" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="p-0">
          <div className="flex flex-col gap-2 p-3">
            <UserInfo
              name={user.name}
              email={user.email}
              image={user.image}
              avatarClassName="h-10 w-10"
            />
            <RoleBadge role={user.role} compact className="w-fit" />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.SETTINGS} className="cursor-pointer">
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.SETTINGS_APPEARANCE} className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

Header.displayName = "Header";