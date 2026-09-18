import {
  GraduationCap,
  School,
  ShieldCheck,
  UserCog,
  BookOpen,
} from "lucide-react";
import type { Role } from "@/types";
import { ROLES } from "@/types";

/* ------------------------------------------------------------------ */
/*  Roles                                                              */
/* ------------------------------------------------------------------ */

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  LECTURER: "Lecturer",
  STUDENT: "Student",
};

export const ROLE_ICONS: Record<Role, typeof GraduationCap> = {
  SUPER_ADMIN: ShieldCheck,
  ADMIN: UserCog,
  LECTURER: School,
  STUDENT: GraduationCap,
};

/** Options for sign-up (public roles only — admins are assigned, not chosen). */
export const SIGNUP_ROLE_OPTIONS = [
  {
    value: ROLES.STUDENT,
    label: ROLE_LABELS.STUDENT,
    icon: ROLE_ICONS.STUDENT,
  },
  {
    value: ROLES.LECTURER,
    label: ROLE_LABELS.LECTURER,
    icon: ROLE_ICONS.LECTURER,
  },
] as const;

/** All roles — used in admin filters, user tables, etc. */
export const ALL_ROLE_OPTIONS = (
  Object.keys(ROLE_LABELS) as Role[]
).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
  icon: ROLE_ICONS[role],
}));

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",

  DASHBOARD: "/dashboard",

  COURSES: "/courses",
  COURSE_NEW: "/courses/new",
  COURSE: (id: string | number) => `/courses/${id}`,
  COURSE_ASSIGNMENTS: (id: string | number) => `/courses/${id}/assignments`,
  COURSE_STUDENTS: (id: string | number) => `/courses/${id}/students`,
  COURSE_SETTINGS: (id: string | number) => `/courses/${id}/settings`,
  COURSE_EDIT: (id: string | number) => `/courses/${id}/edit`,

  CLASSES: "/classes",
  CLASS: (id: string | number) => `/classes/${id}`,
  CLASS_NEW: "/classes/new",
  CLASS_EDIT: (id: string | number) => `/classes/${id}/edit`,

  DEPARTMENTS: "/departments",
  DEPARTMENT: (id: string | number) => `/departments/${id}`,
  DEPARTMENT_NEW: "/departments/new",
   DEPARTMENT_EDIT: (id: string | number) => `/departments/${id}/edit`,

  

  FACULTY: "/faculty",
  FACULTY_MEMBER: (id: string | number) => `/faculty/${id}`,
  FACULTY_MEMBER_EDIT: (id: string | number) => `/faculty/${id}/edit`,

  SUBJECTS: "/subjects",
  SUBJECT: (id: string | number) => `/subjects/${id}`,
  SUBJECT_NEW: "/subjects/new",
  SUBJECT_EDIT: (id: string | number) => `/subjects/${id}/edit`,

  ENROLLMENTS: "/enrollments",
  ENROLLMENT: (id: string | number) => `/enrollments/${id}`,

  ASSIGNMENTS: "/assignments",
  ASSIGNMENT: (id: string | number) => `/assignments/${id}`,

  GRADES: "/grades",
  JOIN: "/join",
  ANNOUNCEMENTS: "/announcements",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER: (id: string | number) => `/admin/users/${id}`,
  ADMIN_UNIVERSITIES: "/admin/universities",
  ADMIN_REPORTS: "/admin/reports",

  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_APPEARANCE: "/settings/appearance",
} as const;

/* ------------------------------------------------------------------ */
/*  Departments (defaults for mock + dropdowns)                        */
/* ------------------------------------------------------------------ */

export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Economics",
  "Business Administration",
  "Engineering",
  "Psychology",
  "Sociology",
  "Political Science",
  "Philosophy",
  "Education",
  "Fine Arts",
  "Music",
  "Physical Education",
  "Law",
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept,
}));

/* ------------------------------------------------------------------ */
/*  File uploads                                                       */
/* ------------------------------------------------------------------ */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FILES_PER_UPLOAD = 5;

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const ALLOWED_ALL_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const;

/** Human-readable accept="" strings for <input type="file" /> */
export const ACCEPT_IMAGE = "image/png,image/jpeg,image/webp";
export const ACCEPT_DOCUMENT = ".pdf,.doc,.docx,.xls,.xlsx";
export const ACCEPT_ALL = `${ACCEPT_IMAGE},${ACCEPT_DOCUMENT}`;

/* ------------------------------------------------------------------ */
/*  Cloudinary (public values — secret stays server-side only)         */
/* ------------------------------------------------------------------ */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export const CLOUDINARY_UPLOAD_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`
  : "";

/** Default folder for course banners, avatars, assignment attachments */
export const CLOUDINARY_FOLDERS = {
  AVATARS: "campuscore/avatars",
  COURSE_COVERS: "campuscore/courses",
  CLASS_BANNERS: "campuscore/classes",
  ASSIGNMENTS: "campuscore/assignments",
} as const;

/* ------------------------------------------------------------------ */
/*  Join codes                                                         */
/* ------------------------------------------------------------------ */

export const JOIN_CODE_LENGTH = 8;

/** Crockford-style alphabet — no 0/O/1/I/L to avoid confusion */
export const JOIN_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";

export const JOIN_CODE_MAX_ATTEMPTS_PER_MINUTE = 5;

/* ------------------------------------------------------------------ */
/*  Pagination & limits                                                */
/* ------------------------------------------------------------------ */

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const MAX_ANNOUNCEMENT_LENGTH = 2000;
export const MAX_ASSIGNMENT_DESCRIPTION = 5000;
export const MAX_COURSE_DESCRIPTION = 1000;

/* ------------------------------------------------------------------ */
/*  Storage keys (localStorage / cookies)                              */
/* ------------------------------------------------------------------ */

export const STORAGE_KEYS = {
  THEME: "campuscore:theme",
  SIDEBAR_OPEN: "campuscore:sidebar",
  RECENT_COURSES: "campuscore:recent-courses",
} as const;

/* ------------------------------------------------------------------ */
/*  Backend                                                             */
/* ------------------------------------------------------------------ */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const ACCESS_TOKEN_KEY = "campuscore:access-token";
export const REFRESH_TOKEN_KEY = "campuscore:refresh-token";




export const CLASS_CAPACITY_MIN = 1;
export const CLASS_CAPACITY_MAX = 500;
export const CLASS_SCHEDULE_MAX = 5;

