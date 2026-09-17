import type { Course } from "@/types";

const now = new Date().toISOString();

export const courses: Course[] = [
  {
    id: 1,
    name: "Introduction to Programming",
    code: "CS101",
    description: "Learn programming fundamentals with Python.",
    subjectId: 1,
    lecturerId: "u_lect1",
    joinCode: "CS101ABC",
    createdAt: now,
  },
  {
    id: 2,
    name: "Data Structures & Algorithms",
    code: "CS201",
    description: "Arrays, linked lists, trees, graphs, sorting, and searching.",
    subjectId: 1,
    lecturerId: "u_lect1",
    joinCode: "CS201XYZ",
    createdAt: now,
  },
  {
    id: 3,
    name: "Calculus II",
    code: "MATH201",
    description: "Advanced integration and series.",
    subjectId: 2,
    lecturerId: "u_lect2",
    joinCode: "MATH2ABC",
    createdAt: now,
  },
  {
    id: 4,
    name: "Modern Literature",
    code: "ENG102",
    description: "Survey of 20th-century literature.",
    subjectId: 3,
    lecturerId: "u_lect1",
    joinCode: "ENG102AB",
    createdAt: now,
  },
];