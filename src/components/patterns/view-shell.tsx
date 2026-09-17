import { cn } from "@/lib/utils";

type ViewShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function ViewShell({ children, className }: ViewShellProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>{children}</div>
  );
}

ViewShell.displayName = "ViewShell";