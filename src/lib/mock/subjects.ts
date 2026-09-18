import type { Subject } from "@/types";

const now = new Date().toISOString();

export const subjects: Subject[] = [
  // Computer Science (dept 1)
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    description: "Fundamentals of programming, algorithms, and computational thinking.",
    departmentId: 1,
    credits: 3,
    createdAt: now,
  },
  {
    id: 2,
    code: "CS201",
    name: "Data Structures & Algorithms",
    description: "Arrays, linked lists, trees, graphs, sorting, and searching.",
    departmentId: 1,
    credits: 4,
    createdAt: now,
  },
  {
    id: 3,
    code: "CS301",
    name: "Operating Systems",
    description: "Processes, threads, memory management, and concurrency.",
    departmentId: 1,
    credits: 4,
    createdAt: now,
  },

  // Mathematics (dept 2)
  {
    id: 4,
    code: "MATH101",
    name: "Calculus I",
    description: "Limits, derivatives, and applications of differentiation.",
    departmentId: 2,
    credits: 4,
    createdAt: now,
  },
  {
    id: 5,
    code: "MATH201",
    name: "Calculus II",
    description: "Integration, sequences, series, and power series.",
    departmentId: 2,
    credits: 4,
    createdAt: now,
  },
  {
    id: 6,
    code: "MATH301",
    name: "Linear Algebra",
    description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
    departmentId: 2,
    credits: 3,
    createdAt: now,
  },

  // Physics (dept 3)
  {
    id: 7,
    code: "PHY101",
    name: "Classical Mechanics",
    description: "Newtonian mechanics, energy, momentum, and rotational motion.",
    departmentId: 3,
    credits: 4,
    createdAt: now,
  },
  {
    id: 8,
    code: "PHY201",
    name: "Electromagnetism",
    description: "Electric fields, magnetic fields, and Maxwell's equations.",
    departmentId: 3,
    credits: 4,
    createdAt: now,
  },

  // Chemistry (dept 4)
  {
    id: 9,
    code: "CHEM101",
    name: "General Chemistry",
    description: "Atomic structure, bonding, stoichiometry, and reactions.",
    departmentId: 4,
    credits: 4,
    createdAt: now,
  },

  // Biology (dept 5)
  {
    id: 10,
    code: "BIO101",
    name: "Introduction to Biology",
    description: "Cell structure, genetics, evolution, and ecology.",
    departmentId: 5,
    credits: 3,
    createdAt: now,
  },

  // English (dept 6)
  {
    id: 11,
    code: "ENG102",
    name: "Literature and Composition",
    description: "Critical reading and writing through literary genres.",
    departmentId: 6,
    credits: 3,
    createdAt: now,
  },
  {
    id: 12,
    code: "ENG201",
    name: "Modern Poetry",
    description: "Survey of 20th-century poets and poetic movements.",
    departmentId: 6,
    credits: 3,
    createdAt: now,
  },

  // History (dept 7)
  {
    id: 13,
    code: "HIST101",
    name: "World History I",
    description: "Ancient civilizations through the early modern period.",
    departmentId: 7,
    credits: 3,
    createdAt: now,
  },

  // Economics (dept 8)
  {
    id: 14,
    code: "ECON101",
    name: "Principles of Microeconomics",
    description: "Supply and demand, market structures, and consumer behavior.",
    departmentId: 8,
    credits: 3,
    createdAt: now,
  },

  // Psychology (dept 10)
  {
    id: 15,
    code: "PSY101",
    name: "Introduction to Psychology",
    description: "Cognition, emotion, personality, and social behavior.",
    departmentId: 10,
    credits: 3,
    createdAt: now,
  },
];