/**
 * Hand picked orbit radii in scene units.
 *
 * Real distances would leave the inner planets stuck together and Neptune off
 * screen, so each gap is set by hand to leave room for the planet spheres.
 * The Jupiter to Saturn gap also leaves room for Saturn's rings, which reach
 * about twice its radius.
 */
const VISUAL_ORBIT_RADII: Record<string, number> = {
  mercury: 60,
  venus: 95,
  earth: 130,
  mars: 165,
  jupiter: 225,
  saturn: 325,
  uranus: 415,
  neptune: 490,
};

/**
 * Orbit radius used to draw a planet and its orbit line.
 * Bodies that are not in the list fall back to a formula based on the real
 * distance, which keeps them in a sensible order.
 */
export function getOrbitRadius(distanceFromSun: number, planetId?: string): number {
  if (planetId && VISUAL_ORBIT_RADII[planetId] !== undefined) {
    return VISUAL_ORBIT_RADII[planetId];
  }

  return Math.pow(Math.log10(distanceFromSun + 1), 1.8) * 3;
}
