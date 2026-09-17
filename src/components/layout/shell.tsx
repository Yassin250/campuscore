import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

type ShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function Shell({ children, className }: ShellProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className={cn("flex-1 p-4 md:p-6 lg:p-8", className)}>
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

Shell.displayName = "Shell";