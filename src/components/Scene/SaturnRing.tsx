import { memo } from "react";
import { DoubleSide } from "three";

/** Ring sizes as a multiple of the planet radius, from inner to outer. */
const BANDS = [
  { inner: 1.12, outer: 1.28, color: "#f7e0a3", opacity: 0.48 },
  { inner: 1.34, outer: 1.55, color: "#c8a46d", opacity: 0.58 },
  { inner: 1.62, outer: 1.86, color: "#f0d89a", opacity: 0.5 },
  { inner: 1.94, outer: 2.18, color: "#8f7654", opacity: 0.32 },
];

/**
 * Saturn's rings, built from a few flat transparent bands instead of one
 * texture. It is cheap to draw and still reads as a ringed planet.
 */
export const SaturnRing = memo(({ planetRadius }: { planetRadius: number }) => (
  <group rotation={[Math.PI / 2 - 0.47, 0, 0]}>
    {BANDS.map((band) => (
      <mesh key={band.inner}>
        <ringGeometry args={[planetRadius * band.inner, planetRadius * band.outer, 160]} />
        <meshBasicMaterial
          color={band.color}
          transparent
          opacity={band.opacity}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    ))}
  </group>
));
