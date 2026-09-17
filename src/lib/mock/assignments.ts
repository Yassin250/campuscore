import type { Assignment, Submission } from "@/types";

const now = new Date().toISOString();
const nextWeek = new Date(Date.now() + 7 * 86400_000).toISOString();
const lastWeek = new Date(Date.now() - 7 * 86400_000).toISOString();

export const assignments: Assignment[] = [
  {
    id: 1,
    title: "Week 1 — Hello, World",
    description: "Write a program that prints 'Hello, World' and your name.",
    classId: 1,
    dueDate: lastWeek,
    points: 10,
    createdAt: lastWeek,
  },
  {
    id: 2,
    title: "Week 2 — Loops & Conditionals",
    description: "Implement FizzBuzz and a simple calculator with if/else.",
    classId: 1,
    dueDate: now,
    points: 20,
    createdAt: lastWeek,
  },
  {
    id: 3,
    title: "Week 3 — Functions",
    description: "Write five utility functions with proper docstrings.",
    classId: 1,
    dueDate: nextWeek,
    points: 30,
    createdAt: now,
  },
  {
    id: 4,
    title: "Problem Set 1 — Integration",
    description: "Solve problems 1–15 from the chapter 5 handout.",
    classId: 3,
    dueDate: nextWeek,
    points: 50,
    createdAt: now,
  },
];

export const submissions: Submission[] = [
  {
    id: 1,
    assignmentId: 1,
    studentId: "u_std1",
    content: "Here is my Hello World submission.",
    status: "graded",
    submittedAt: lastWeek,
  },
  {
    id: 2,
    assignmentId: 1,
    studentId: "u_std2",
    content: "My submission.",
    status: "graded",
    submittedAt: lastWeek,
  },
  {
    id: 3,
    assignmentId: 2,
    studentId: "u_std1",
    content: "FizzBuzz and calculator attached.",
    status: "submitted",
    submittedAt: now,
  },
  {
    id: 4,
    assignmentId: 2,
    studentId: "u_std2",
    content: "Done.",
    status: "late",
    submittedAt: now,
  },
  {
    id: 5,
    assignmentId: 3,
    studentId: "u_std3",
    content: "Functions submitted.",
    status: "graded",
    submittedAt: lastWeek,
  },
  {
    id: 6,
    assignmentId: 4,
    studentId: "u_std1",
    content: "Attached my solutions to problem set 1.",
    status: "graded",
    submittedAt: now,
  },
];