import { useEffect, useState } from "react";

/**
 * Reactive wrapper around window.matchMedia.
 * Kept small and dependency-free because it is used by performance-sensitive UI.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = () => window.matchMedia(query).matches;
  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
