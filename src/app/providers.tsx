"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/notifications/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="campuscore-theme"
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}