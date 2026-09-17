import type { Enrollment } from "@/types";

const now = new Date().toISOString();

export const enrollments: Enrollment[] = [
  { id: 1, studentId: "u_std1", classId: 1, status: "active", joinedAt: now },
  { id: 2, studentId: "u_std2", classId: 1, status: "active", joinedAt: now },
  { id: 3, studentId: "u_std3", classId: 1, status: "active", joinedAt: now },
  { id: 4, studentId: "u_std1", classId: 2, status: "active", joinedAt: now },
  { id: 5, studentId: "u_std2", classId: 2, status: "active", joinedAt: now },
  { id: 6, studentId: "u_std1", classId: 3, status: "active", joinedAt: now },
  { id: 7, studentId: "u_std3", classId: 3, status: "dropped", joinedAt: now },
];