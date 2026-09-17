import {
  BookOpen,
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Building2,
  Library,
  ClipboardList,
  FileText,
  Megaphone,
  Award,
  UserCog,
  ShieldCheck,
  BarChart3,
  Settings,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";
import { ROUTES } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional badge shown to the right of the label (e.g., "new", "3") */
  badge?: string;
  /** If true, only match when the pathname is exactly `href` (not prefixed) */
  exact?: boolean;
};

export type NavSection = {
  /** Optional section title — rendered as a divider + label */
  title?: string;
  items: NavItem[];
};

/* ------------------------------------------------------------------ */
/*  Nav sections — one per role                                        */
/* ------------------------------------------------------------------ */

const STUDENT_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "My Courses", href: ROUTES.COURSES, icon: BookOpen },
      { label: "Assignments", href: ROUTES.ASSIGNMENTS, icon: ClipboardList },
      { label: "Grades", href: ROUTES.GRADES, icon: Award },
    ],
  },
  {
    title: "Discover",
    items: [
      { label: "Join a Class", href: ROUTES.JOIN, icon: LogIn },
      { label: "Announcements", href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: ROUTES.SETTINGS, icon: Settings }],
  },
];

const LECTURER_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Courses", href: ROUTES.COURSES, icon: BookOpen },
      { label: "Classes", href: ROUTES.CLASSES, icon: School },
      { label: "Assignments", href: ROUTES.ASSIGNMENTS, icon: ClipboardList },
      { label: "Enrollments", href: ROUTES.ENROLLMENTS, icon: Users },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Subjects", href: ROUTES.SUBJECTS, icon: Library },
      { label: "Departments", href: ROUTES.DEPARTMENTS, icon: Building2 },
      { label: "Faculty", href: ROUTES.FACULTY, icon: GraduationCap },
    ],
  },
  {
    title: "Teaching",
    items: [
      { label: "Announcements", href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
      { label: "Gradebook", href: ROUTES.GRADES, icon: Award },
      { label: "Reports", href: ROUTES.ADMIN_REPORTS, icon: FileText },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: ROUTES.SETTINGS, icon: Settings }],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
      { label: "Courses", href: ROUTES.COURSES, icon: BookOpen },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Departments", href: ROUTES.DEPARTMENTS, icon: Building2 },
      { label: "Subjects", href: ROUTES.SUBJECTS, icon: Library },
      { label: "Faculty", href: ROUTES.FACULTY, icon: GraduationCap },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Announcements", href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
      { label: "Reports", href: ROUTES.ADMIN_REPORTS, icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: ROUTES.SETTINGS, icon: Settings }],
  },
];

const SUPER_ADMIN_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
      { label: "Universities", href: ROUTES.ADMIN_UNIVERSITIES, icon: ShieldCheck },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Courses", href: ROUTES.COURSES, icon: BookOpen },
      { label: "Departments", href: ROUTES.DEPARTMENTS, icon: Building2 },
      { label: "Subjects", href: ROUTES.SUBJECTS, icon: Library },
      { label: "Faculty", href: ROUTES.FACULTY, icon: GraduationCap },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Announcements", href: ROUTES.ANNOUNCEMENTS, icon: Megaphone },
      { label: "Reports", href: ROUTES.ADMIN_REPORTS, icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: ROUTES.SETTINGS, icon: Settings }],
  },
];

/* ------------------------------------------------------------------ */
/*  Role → nav map                                                     */
/* ------------------------------------------------------------------ */

const NAV_BY_ROLE: Record<Role, NavSection[]> = {
  STUDENT: STUDENT_NAV,
  LECTURER: LECTURER_NAV,
  ADMIN: ADMIN_NAV,
  SUPER_ADMIN: SUPER_ADMIN_NAV,
};

/**
 * Returns the sidebar nav sections for a given role.
 * Sections with no visible items are filtered out so you don't get
 * an orphan "Operations" heading.
 */
export function getNavForRole(role: Role): NavSection[] {
  return NAV_BY_ROLE[role].filter((section) => section.items.length > 0);
}

/**
 * Returns a flat list of all nav items for a role, ignoring sections.
 * Useful for the command palette (⌘K) or a sitemap page.
 */
export function getFlatNavForRole(role: Role): NavItem[] {
  return getNavForRole(role).flatMap((section) => section.items);
}