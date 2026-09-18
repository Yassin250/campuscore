import { JOIN_CODE_ALPHABET, JOIN_CODE_LENGTH } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Generation                                                         */
/* ------------------------------------------------------------------ */

/**
 * Generate a random join code.
 *
 * Format: 8 characters from a Crockford-style alphabet that omits
 * visually ambiguous letters (0, O, 1, I, L). Codes are uppercase
 * and easy to read aloud or type.
 *
 * Example: "HKM4R9TB"
 *
 * NOTE: this is a client-side helper for mocks/demos. When the backend
 * exists, the real code must be generated server-side with a uniqueness
 * check against the database.
 */
export function generateJoinCode(length = JOIN_CODE_LENGTH): string {
  const alphabet = JOIN_CODE_ALPHABET;
  const bytes = new Uint8Array(length);

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // Fallback for non-crypto environments — never use in production
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

/** "HKM4R9TB" → "HKM4-R9TB" — easier to read and share. */
export function formatJoinCode(code: string): string {
  if (code.length <= 4) return code;
  const mid = Math.ceil(code.length / 2);
  return `${code.slice(0, mid)}-${code.slice(mid)}`;
}

/** Strip any user-typed separators and uppercase the result. */
export function normalizeJoinCode(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/** True if the input looks like a valid join code (length + alphabet). */
export function isValidJoinCodeShape(input: string): boolean {
  const clean = normalizeJoinCode(input);
  if (clean.length !== JOIN_CODE_LENGTH) return false;
  for (const ch of clean) {
    if (!JOIN_CODE_ALPHABET.includes(ch)) return false;
  }
  return true;
}