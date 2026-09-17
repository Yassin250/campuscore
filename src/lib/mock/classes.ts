import type { ClassDetails } from "@/types";

const now = new Date().toISOString();

export const classes: ClassDetails[] = [
  {
    id: 1,
    name: "CS101-A — Spring 2026",
    description: "Morning section of Intro to Programming.",
    status: "active",
    capacity: 40,
    courseId: 1,
    lecturerId: "u_lect1",
    joinCode: "CS101A26",
    schedules: [
      { day: "Mon", startTime: "09:00", endTime: "10:30", room: "B-201" },
      { day: "Wed", startTime: "09:00", endTime: "10:30", room: "B-201" },
    ],
    createdAt: now,
  },
  {
    id: 2,
    name: "CS201-A — Spring 2026",
    description: "Data structures section A.",
    status: "active",
    capacity: 35,
    courseId: 2,
    lecturerId: "u_lect1",
    joinCode: "CS201A26",
    schedules: [
      { day: "Tue", startTime: "14:00", endTime: "15:30", room: "A-105" },
      { day: "Thu", startTime: "14:00", endTime: "15:30", room: "A-105" },
    ],
    createdAt: now,
  },
  {
    id: 3,
    name: "MATH201-A — Spring 2026",
    description: "Calculus II section A.",
    status: "active",
    capacity: 50,
    courseId: 3,
    lecturerId: "u_lect2",
    joinCode: "MTH201A2",
    schedules: [
      { day: "Mon", startTime: "11:00", endTime: "12:30", room: "C-301" },
      { day: "Fri", startTime: "11:00", endTime: "12:30", room: "C-301" },
    ],
    createdAt: now,
  },
  {
    id: 4,
    name: "ENG102-A — Spring 2026",
    description: "Modern Literature discussion section.",
    status: "inactive",
    capacity: 25,
    courseId: 4,
    lecturerId: "u_lect1",
    joinCode: "ENG102A2",
    schedules: [
      { day: "Wed", startTime: "16:00", endTime: "17:30", room: "D-102" },
    ],
    createdAt: now,
  },
];