import type { Department } from "@/types";

export const departments: Department[] = [
  { id: 1, name: "Computer Science", code: "CS", description: "Computing, software, and systems.", facultyId: 1 },
  { id: 2, name: "Mathematics",      code: "MATH", description: "Pure and applied mathematics.", facultyId: 1 },
  { id: 3, name: "Physics",          code: "PHY", description: "Theoretical and experimental physics.", facultyId: 1 },
  { id: 4, name: "Chemistry",        code: "CHEM", description: "Organic, inorganic, and physical chemistry.", facultyId: 1 },
  { id: 5, name: "Biology",          code: "BIO", description: "Life sciences and ecology.", facultyId: 1 },
  { id: 6, name: "English",          code: "ENG", description: "Literature, composition, and linguistics.", facultyId: 2 },
  { id: 7, name: "History",          code: "HIST", description: "World and regional history.", facultyId: 2 },
  { id: 8, name: "Economics",        code: "ECON", description: "Micro and macroeconomics.", facultyId: 3 },
  { id: 9, name: "Engineering",      code: "ENGR", description: "Mechanical, electrical, and civil engineering.", facultyId: 1 },
  { id: 10, name: "Psychology",      code: "PSY", description: "Behavior and mental processes.", facultyId: 2 },
];