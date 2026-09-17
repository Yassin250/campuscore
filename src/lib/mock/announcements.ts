import type { Announcement } from "@/types";

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400_000).toISOString();

export const announcements: Announcement[] = [
  {
    id: 1,
    classId: 1,
    authorId: "u_lect1",
    title: "Welcome to CS101",
    body: "Looking forward to a great semester. Please review the syllabus before Monday.",
    createdAt: yesterday,
  },
  {
    id: 2,
    classId: 1,
    authorId: "u_lect1",
    body: "Reminder: Week 2 assignment is due tonight at 11:59 PM.",
    createdAt: now,
  },
  {
    id: 3,
    classId: 2,
    authorId: "u_lect1",
    title: "Reading list posted",
    body: "Chapter 3 is required before Tuesday's class.",
    createdAt: yesterday,
  },
];