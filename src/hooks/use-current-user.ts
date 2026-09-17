"use client";

import type { SessionUser } from "@/types";
import { users } from "@/lib/mock/user";

/* ------------------------------------------------------------------ */
/*  MOCK USER — delete this whole block when NextAuth is wired        */
/* ------------------------------------------------------------------ */

/**
 * The mock user id that the app pretends is logged in.
 * Change this to switch roles while building:
 *   "u_admin"  → ADMIN
 *   "u_lect1"  → LECTURER  (default — richest dashboard)
 *   "u_std1"   → STUDENT
 */
const MOCK_USER_ID = "u_lect1";

function getMockUser(): SessionUser {
  const user = users.find((u) => u.id === MOCK_USER_ID) ?? users[1];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image ?? null,
  };
}

/* ------------------------------------------------------------------ */
/*  HOOK                                                               */
/* ------------------------------------------------------------------ */

/**
 * Returns the currently authenticated user.
 *
 * Today: reads from `lib/mock/users.ts`.
 * Later: swap `getMockUser()` for `await auth()` from NextAuth.
 * The return shape (SessionUser) never changes, so no caller breaks.
 */
export function useCurrentUser(): SessionUser {
  return getMockUser();
}