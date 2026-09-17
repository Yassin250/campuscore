import type { LucideIcon } from "lucide-react";
import { GraduationCap } from "lucide-react";

export const APP_NAME = "CampusCore";
export const APP_SHORT_NAME = "CampusCore";
export const APP_TAGLINE = "University management, simplified.";
export const APP_DESCRIPTION =
  "CampusCore is a modern university management platform for courses, classes, assignments, and grades.";

export const APP_LOGO: LucideIcon = GraduationCap;
export const APP_LOGO_URL = "/logo.svg";

export const APP_DOMAIN = "campuscore.dev";
export const APP_SUPPORT_EMAIL = "support@campuscore.dev";

/** Browser tab title with the app name appended */
export const formatTitle = (page?: string) =>
  page ? `${page} · ${APP_NAME}` : APP_NAME;

/** Default OG metadata for pages that don't override */
export const DEFAULT_OG = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  url: `https://${APP_DOMAIN}`,
  siteName: APP_NAME,
  images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  type: "website" as const,
};

/** Social / footer links */
export const SOCIAL_LINKS = {
  github: "https://github.com/campuscore",
  twitter: "https://twitter.com/campuscore",
  docs: "https://docs.campuscore.dev",
} as const;