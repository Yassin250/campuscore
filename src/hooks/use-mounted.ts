"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` on the server and on the very first client render,
 * then flips to `true` after the component has mounted in the browser.
 *
 * Use it to avoid hydration mismatches when rendering browser-only values:
 *
 *   const mounted = useMounted();
 *   if (!mounted) return null;               // server renders nothing
 *   return <div>{localStorage.getItem("x")}</div>;  // client renders real value
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}