"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  List,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "./confirm-dialog";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  CreateButton — navigate to a "new" route                          */
/* ================================================================== */

type CreateButtonProps = {
  /** Destination URL — usually a `/new` route */
  href: string;
  /** Button label. Default "Create". */
  label?: string;
} & Omit<React.ComponentProps<typeof Button>, "asChild" | "children">;

export const CreateButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  CreateButtonProps
>(({ href, label = "Create", className, variant = "default", size, ...rest }, ref) => (
  <Button
    ref={ref}
    asChild
    variant={variant}
    size={size}
    className={className}
    {...rest}
  >
    <Link href={href}>
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  </Button>
));
CreateButton.displayName = "CreateButton";

/* ================================================================== */
/*  ShowButton — navigate to a detail route (icon-only)               */
/* ================================================================== */

type ShowButtonProps = {
  href: string;
  /** Tooltip + aria-label. Default "View". */
  label?: string;
} & Omit<React.ComponentProps<typeof Button>, "asChild" | "children">;

export const ShowButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  ShowButtonProps
>(
  (
    { href, label = "View", className, variant = "ghost", size = "icon", ...rest },
    ref
  ) => (
    <Button
      ref={ref}
      asChild
      variant={variant}
      size={size}
      className={cn("h-8 w-8", className)}
      title={label}
      aria-label={label}
      {...rest}
    >
      <Link href={href}>
        <Eye className="h-4 w-4" />
      </Link>
    </Button>
  )
);
ShowButton.displayName = "ShowButton";

/* ================================================================== */
/*  EditButton — navigate to an edit route (icon-only)                */
/* ================================================================== */

type EditButtonProps = {
  href: string;
  /** Tooltip + aria-label. Default "Edit". */
  label?: string;
} & Omit<React.ComponentProps<typeof Button>, "asChild" | "children">;

export const EditButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  EditButtonProps
>(
  (
    { href, label = "Edit", className, variant = "ghost", size = "icon", ...rest },
    ref
  ) => (
    <Button
      ref={ref}
      asChild
      variant={variant}
      size={size}
      className={cn("h-8 w-8", className)}
      title={label}
      aria-label={label}
      {...rest}
    >
      <Link href={href}>
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  )
);
EditButton.displayName = "EditButton";

/* ================================================================== */
/*  DeleteButton — confirm, then run callback (icon-only)             */
/* ================================================================== */

type DeleteButtonProps = {
  /** Name of the item being deleted — used in the confirmation text */
  itemName?: string;
  /** Custom dialog title. Defaults to "Delete this item?" */
  title?: string;
  /** Custom dialog description */
  description?: string;
  /** Called when user confirms. Can be async. */
  onConfirm: () => void | Promise<void>;
} & Omit<React.ComponentProps<typeof Button>, "asChild" | "children" | "onClick">;

export const DeleteButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  DeleteButtonProps
>(
  (
    {
      itemName,
      title,
      description,
      onConfirm,
      className,
      variant = "ghost",
      size = "icon",
      disabled,
      ...rest
    },
    ref
  ) => {
    const dialogTitle = title ?? "Delete this item?";
    const dialogDescription =
      description ??
      (itemName
        ? `This will permanently remove ${itemName}. This can't be undone.`
        : "This action cannot be undone.");

    return (
      <ConfirmDialog
        variant="destructive"
        title={dialogTitle}
        description={dialogDescription}
        confirmLabel="Delete"
        onConfirm={onConfirm}
        trigger={
          <Button
            ref={ref}
            variant={variant}
            size={size}
            disabled={disabled}
            className={cn(
              "h-8 w-8",
              "text-muted-foreground hover:text-destructive",
              className
            )}
            title="Delete"
            aria-label="Delete"
            {...rest}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
    );
  }
);
DeleteButton.displayName = "DeleteButton";

/* ================================================================== */
/*  RefreshButton — reruns a callback, shows spinner while loading    */
/* ================================================================== */

type RefreshButtonProps = {
  /** Callback — usually `refetch` from React Query */
  onClick: () => void | Promise<void>;
  /** Show a spinner and disable the button. Parent controls this. */
  isLoading?: boolean;
  /** Label text. Default "Refresh". */
  label?: string;
  /** If true, hide the text and show only the icon. */
  iconOnly?: boolean;
} & Omit<React.ComponentProps<typeof Button>, "onClick" | "children">;

export const RefreshButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  RefreshButtonProps
>(
  (
    {
      onClick,
      isLoading = false,
      label = "Refresh",
      iconOnly = false,
      className,
      variant = "outline",
      size = iconOnly ? "icon" : "default",
      disabled,
      ...rest
    },
    ref
  ) => (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(iconOnly && "h-8 w-8", className)}
      title={iconOnly ? label : undefined}
      aria-label={label}
      {...rest}
    >
      <RefreshCcw
        className={cn("h-4 w-4", isLoading && "animate-spin")}
      />
      {!iconOnly && <span>{label}</span>}
    </Button>
  )
);
RefreshButton.displayName = "RefreshButton";

/* ================================================================== */
/*  ListButton — navigate back to a list route                        */
/* ================================================================== */

type ListButtonProps = {
  href: string;
  /** Label. Default "Back to list". */
  label?: string;
  /** Icon only, no label */
  iconOnly?: boolean;
} & Omit<React.ComponentProps<typeof Button>, "asChild" | "children">;

export const ListButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  ListButtonProps
>(
  (
    {
      href,
      label = "Back to list",
      iconOnly = false,
      className,
      variant = "outline",
      size = iconOnly ? "icon" : "default",
      ...rest
    },
    ref
  ) => (
    <Button
      ref={ref}
      asChild
      variant={variant}
      size={size}
      className={cn(iconOnly && "h-8 w-8", className)}
      title={iconOnly ? label : undefined}
      aria-label={label}
      {...rest}
    >
      <Link href={href}>
        <List className="h-4 w-4" />
        {!iconOnly && <span>{label}</span>}
      </Link>
    </Button>
  )
);
ListButton.displayName = "ListButton";