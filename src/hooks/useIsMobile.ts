import { useMediaQuery } from "./useMediaQuery";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true when the viewport width is at or below the mobile breakpoint.
 * Updates reactively on window resize.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
}
