
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from "date-fns";

/**
 * Merge Tailwind class names, resolving conflicts.
 * The backbone of every shadcn component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ */
/*  Dates                                                              */
/* ------------------------------------------------------------------ */

/** "Sep 15, 2026" */
export function fmtDate(date: Date | string | number): string {
  return format(new Date(date), "MMM d, yyyy");
}

/** "Sep 15, 2026 · 2:30 PM" */
export function fmtDateTime(date: Date | string | number): string {
  return format(new Date(date), "MMM d, yyyy · h:mm a");
}

/** "2:30 PM" */
export function fmtTime(date: Date | string | number): string {
  return format(new Date(date), "h:mm a");
}

/** "3 hours ago", "in 2 days" */
export function fmtRelative(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Friendly due-date label used on assignments.
 * "Today · 11:59 PM", "Tomorrow · 11:59 PM", "Sep 20", "Overdue"
 */
export function fmtDueDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isPast(d)) return "Overdue";
  if (isToday(d)) return `Today · ${fmtTime(d)}`;
  if (isTomorrow(d)) return `Tomorrow · ${fmtTime(d)}`;
  return fmtDate(d);
}

/* ------------------------------------------------------------------ */
/*  Strings                                                            */
/* ------------------------------------------------------------------ */

/** "Ada Lovelace" → "AL"; "" → "?" */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** "CS101 Introduction to Programming" → "cs101-introduction-to-programming" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** "A very long course description…" → "A very long course…" */
export function truncate(input: string, max = 80): string {
  if (input.length <= max) return input;
  return input.slice(0, max).trimEnd() + "…";
}

/** Pluralize based on count: pluralize(3, "student") → "3 students" */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : plural ?? `${singular}s`;
  return `${count} ${word}`;
}

/* ------------------------------------------------------------------ */
/*  Numbers                                                            */
/* ------------------------------------------------------------------ */

/** 1250 → "1.3K", 1500000 → "1.5M" */
export function compactNumber(n: number): string {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** 87.5 → "88%" */
export function pct(n: number): string {
  return `${Math.round(n)}%`;
}

/** Grade letter from score out of max (default 100) */
export function gradeLetter(score: number, max = 100): string {
  const p = (score / max) * 100;
  if (p >= 90) return "A";
  if (p >= 80) return "B";
  if (p >= 70) return "C";
  if (p >= 60) return "D";
  return "F";
}

/* ------------------------------------------------------------------ */
/*  Arrays                                                             */
/* ------------------------------------------------------------------ */

/** Group array items by a key */
export function groupBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

/** Unique values by key */
export function uniqueBy<T, K>(items: T[], getKey: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Async                                                              */
/* ------------------------------------------------------------------ */

/** Wait N ms — useful for simulating network latency in mocks */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add to src/lib/utils.ts
import type { Grade } from "@/types";

/** Average of a list of grades, as a percentage (0–100). */
export function averageGradePercent(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
  return Math.round(total / grades.length);
}

export function countBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K
): Record<K, number> {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}