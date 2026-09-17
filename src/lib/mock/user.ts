import type { User } from "@/types";

const now = new Date().toISOString();

export const users: User[] = [
  {
    id: "u_admin",
    email: "admin@campuscore.dev",
    name: "Amara Okafor",
    role: "ADMIN",
    departmentId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "u_lect1",
    email: "ada@campuscore.dev",
    name: "Ada Lovelace",
    role: "LECTURER",
    departmentId: 1,
    bio: "Teaching programming fundamentals and algorithms.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "u_lect2",
    email: "alan@campuscore.dev",
    name: "Alan Turing",
    role: "LECTURER",
    departmentId: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "u_std1",
    email: "grace@campuscore.dev",
    name: "Grace Hopper",
    role: "STUDENT",
    departmentId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "u_std2",
    email: "linus@campuscore.dev",
    name: "Linus Torvalds",
    role: "STUDENT",
    departmentId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "u_std3",
    email: "margaret@campuscore.dev",
    name: "Margaret Hamilton",
    role: "STUDENT",
    departmentId: 1,
    createdAt: now,
    updatedAt: now,
  },
];