"use client";

import { cn } from "@/lib/utils";

type FormShellProps = React.ComponentProps<"form">;

export function FormShell({
  className,
  children,
  ...props
}: FormShellProps) {
  return (
    <form
      className={cn("space-y-6", className)}
      noValidate
      {...props}
    >
      {children}
    </form>
  );
}

FormShell.displayName = "FormShell";