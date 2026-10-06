import { memo } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Planet as PlanetType } from "../../types/planet";

/** Color and thickness of the haze around the planets that have one. */
function getAtmosphere(planetId: string) {
  switch (planetId) {
    case "earth":
      return { color: "#5bbcff", opacity: 0.2, scale: 1.035 };
    case "venus":
      return { color: "#f5c66b", opacity: 0.12, scale: 1.025 };
    case "mars":
      return { color: "#e27b58", opacity: 0.08, scale: 1.02 };
    case "uranus":
      return { color: "#80f2ff", opacity: 0.1, scale: 1.025 };
    case "neptune":
      return { color: "#5c7cff", opacity: 0.12, scale: 1.025 };
    default:
      return null;
  }
}

/**
 * Slightly bigger sphere around a planet that fakes its atmosphere.
 *
 * Only the inside faces are drawn (BackSide), which leaves a bright rim on the
 * edge of the planet instead of a solid ball of color in front of it.
 */
export const AtmosphereShell = memo(
  ({ planet, segments }: { planet: PlanetType; segments: number }) => {
    const atmosphere = getAtmosphere(planet.id);
    if (!atmosphere) return null;

    return (
      <mesh scale={atmosphere.scale}>
        <sphereGeometry args={[planet.relativeSize, segments, segments]} />
        <meshBasicMaterial
          color={atmosphere.color}
          transparent
          opacity={atmosphere.opacity}
          side={BackSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    );
  }
);
