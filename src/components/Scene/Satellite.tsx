import { Suspense, memo, useState } from "react";
import { useTexture } from "@react-three/drei";
import type { Texture } from "three";
import type { Satellite as SatelliteType } from "../../types/planet";
import { useOrbitPosition } from "../../hooks/useOrbitPosition";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SceneTooltip } from "./SceneTooltip";
import { pointerCursorProps } from "./pointerCursor";

interface SatelliteProps {
  satellite: SatelliteType;
  /** Parent planet relativeSize. Scales the orbit radius and the selected size. */
  planetSize: number;
  /** When true the moon is drawn bigger so it can be seen from the camera. */
  isSelected?: boolean;
}

interface SatelliteMeshProps {
  satellite: SatelliteType;
  onHover?: (hovered: boolean) => void;
  segments: number;
  texture?: Texture;
}

/**
 * Turns a moon name into an angle between 0 and 2π, so the moons of a planet
 * start spread around it and the same moon always starts in the same place.
 */
function getInitialOrbitAngle(name: string): number {
  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }

  return (hash / 0xffffffff) * Math.PI * 2;
}

const SatelliteMesh = ({ satellite, onHover, segments, texture }: SatelliteMeshProps) => (
  <mesh {...pointerCursorProps(onHover)}>
    <sphereGeometry args={[satellite.size, segments, segments]} />
    <meshStandardMaterial
      map={texture ?? null}
      color={texture ? "#ffffff" : satellite.color ?? "#A0A0A0"}
      metalness={0.1}
      roughness={0.7}
    />
  </mesh>
);

/** Loads the texture. useTexture suspends, so it needs its own component. */
const TexturedSatelliteMesh = (props: SatelliteMeshProps) => {
  const texture = useTexture(props.satellite.texturePath!);
  return <SatelliteMesh {...props} texture={texture} />;
};

/**
 * A moon orbiting its planet.
 *
 * It must live inside the planet's orbit group so its position is relative to
 * the planet. The orbit is flat on the planet's XZ plane and ignores the
 * planet's axial tilt.
 */
export const Satellite = memo(({ satellite, planetSize, isSelected }: SatelliteProps) => {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const segments = isMobile ? 8 : 16;

  const orbitRadius = satellite.orbitRadius * planetSize;
  const groupRef = useOrbitPosition(
    orbitRadius,
    satellite.orbitSpeed,
    getInitialOrbitAngle(satellite.name)
  );

  // Real moons would be a few pixels wide, so they are blown up while their
  // planet is selected. Bigger planets (Jupiter 25) need a bigger boost than
  // smaller ones (Earth 10).
  const selectedScale = Math.max(2.5, planetSize * 0.15);
  const scale = isSelected ? selectedScale : 1;

  const meshProps = { satellite, onHover: setHovered, segments };

  return (
    // The outer group carries the orbit position. The scale goes on an inner
    // group so the tooltip can be placed in unscaled space.
    <group ref={groupRef}>
      <group scale={scale}>
        {satellite.texturePath ? (
          <Suspense fallback={<SatelliteMesh {...meshProps} />}>
            <TexturedSatelliteMesh {...meshProps} />
          </Suspense>
        ) : (
          <SatelliteMesh {...meshProps} />
        )}
      </group>
      {hovered && <SceneTooltip y={satellite.size * scale + 0.4} title={satellite.name} />}
    </group>
  );
});
