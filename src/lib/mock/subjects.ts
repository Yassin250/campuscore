import type { Subject } from "@/types";

const now = new Date().toISOString();

export const subjects: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science and programming.",
    departmentId: 1,
    credits: 3,
    createdAt: now,
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    description: "Integration, sequences, series, and power series.",
    departmentId: 2,
    credits: 4,
    createdAt: now,
  },
  {
    id: 3,
    code: "ENG102",
    name: "Literature and Composition",
    description: "Critical reading and writing through literary genres.",
    departmentId: 6,
    credits: 3,
    createdAt: now,
  },
  {
    id: 4,
    code: "PHY101",
    name: "Classical Mechanics",
    description: "Newtonian mechanics, energy, and momentum.",
    departmentId: 3,
    credits: 4,
    createdAt: now,
  },
];