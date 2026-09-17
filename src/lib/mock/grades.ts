import type { Grade } from "@/types";

const now = new Date().toISOString();
const lastWeek = new Date(Date.now() - 7 * 86400_000).toISOString();

export const grades: Grade[] = [
  {
    id: 1,
    submissionId: 1,
    studentId: "u_std1",
    score: 10,
    maxScore: 10,
    feedback: "Perfect.",
    gradedAt: lastWeek,
  },
  {
    id: 2,
    submissionId: 2,
    studentId: "u_std2",
    score: 8,
    maxScore: 10,
    feedback: "Missing your name in output.",
    gradedAt: lastWeek,
  },
  {
    id: 3,
    submissionId: 5,
    studentId: "u_std3",
    score: 15,
    maxScore: 20,
    feedback: "Good logic, but edge cases not handled.",
    gradedAt: now,
  },
  {
    id: 4,
    submissionId: 6,
    studentId: "u_std1",
    score: 45,
    maxScore: 50,
    feedback: "Excellent work. Watch the sign conventions in problem 12.",
    gradedAt: now,
  },
];