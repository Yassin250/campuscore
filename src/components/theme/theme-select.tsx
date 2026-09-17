"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: ReactNode;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeSelect({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            {current.icon}
            <span>{current.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {THEME_OPTIONS.map((option) => {
          const isSelected = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="relative cursor-pointer pr-8"
            >
              {option.icon}
              <span>{option.label}</span>
              {isSelected && (
                <Check className="absolute right-2 h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}