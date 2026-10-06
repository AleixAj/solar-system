/** Shapes of the data in src/data/planets.ts. */

export interface Satellite {
  /** Name of the moon, shown in the UI */
  name: string;
  /** Orbit radius as a multiple of the planet's relativeSize */
  orbitRadius: number;
  /** Orbit speed in radians per simulation step */
  orbitSpeed: number;
  /** Sphere radius in scene units */
  size: number;
  /** Texture served from /public, for example "/textures/satellites/moon.jpg" */
  texturePath?: string;
  /** Flat color used when there is no texture */
  color?: string;
}

export interface Planet {
  /** Unique id. Also used as the mesh name so the camera can find the body */
  id: string;
  /** English name. The Spanish one lives in LanguageContext */
  name: string;
  /** Equatorial diameter in kilometres */
  diameter: number;
  /** Mean distance from the Sun in kilometres */
  distanceFromSun: number;
  /** Mean surface (or cloud top) temperature in Kelvin */
  temperature: number;
  /** Number of known moons, which is more than the ones drawn in the scene */
  numberOfSatellites: number;
  /** Family of body. Decides the material and the label in the info panel */
  type: "terrestrial" | "gas-giant" | "ice-giant" | "star";
  /** Short fact shown at the bottom of the info panel */
  funFact: string;
  /** Color used for labels, dots and the selection glow */
  baseColor: string;
  /** Sphere radius in scene units. Not the real scale, or planets would be dots */
  relativeSize: number;
  /** Spin speed in radians per simulation step. Negative spins backwards */
  rotationSpeed: number;
  /** Tilt of the axis in degrees */
  axialTilt: number;
  /** Orbit speed in radians per simulation step */
  orbitSpeed: number;
  /** Texture served from /public, for example "/textures/earth.jpg" */
  texture?: string;
  /** Best known moons, the ones drawn in the scene */
  satellites?: Satellite[];
}
