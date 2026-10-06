import { memo, useMemo, useState } from "react";
import { useTexture } from "@react-three/drei";
import type { Planet as PlanetType } from "../../types/planet";
import { planets } from "../../data/planets";
import { getOrbitRadius } from "../../utils/orbitUtils";
import { useLanguage } from "../../context/LanguageContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useOrbitPosition } from "../../hooks/useOrbitPosition";
import { AtmosphereShell } from "./AtmosphereShell";
import { Orbit } from "./Orbit";
import { PlanetSurface } from "./PlanetSurface";
import { Satellite } from "./Satellite";
import { SaturnRing } from "./SaturnRing";
import { SceneTooltip } from "./SceneTooltip";
import { SelectionArrow } from "./SelectionArrow";

// Start downloading the planet textures as soon as this file loads, before any
// planet is on screen. Moon textures are left out on purpose: they are only
// visible after picking a planet, so loading them later makes the first paint
// faster on slow connections.
planets.forEach((p) => {
  if (p.texture) useTexture.preload(p.texture);
});

interface PlanetProps {
  planet: PlanetType;
  /** Position in the planet list. Used to spread the starting orbit angles. */
  index: number;
  onSelect?: (planet: PlanetType) => void;
  isSelected?: boolean;
}

/** Kept apart from Planet so only this label redraws when the language changes. */
const PlanetTooltip = memo(({ planet }: { planet: PlanetType }) => {
  const { getPlanetName } = useLanguage();

  return (
    <SceneTooltip
      y={planet.relativeSize + 1.8}
      title={getPlanetName(planet)}
      subtitle={`⌀ ${planet.diameter.toLocaleString()} km`}
      titleColor={planet.baseColor}
      borderColor={`${planet.baseColor}55`}
      glow={`0 0 12px ${planet.baseColor}33`}
    />
  );
});

/**
 * One planet: the sphere, its extras (rings, atmosphere, moons) and the orbit
 * movement around the Sun.
 */
export const Planet = memo(({ planet, index, onSelect, isSelected }: PlanetProps) => {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);

  const orbitRadius = getOrbitRadius(planet.distanceFromSun, planet.id);
  // Spread the planets around the Sun instead of lining them all up.
  const initialAngle = (index * Math.PI * 2) / 8;
  const groupRef = useOrbitPosition(orbitRadius, planet.orbitSpeed, initialAngle, -1);

  // Simpler spheres on phones to save GPU work.
  const sphereSegments = isMobile ? 24 : 32;

  // On mobile only the moons that have a texture are worth drawing.
  const satellitesToRender = useMemo(
    () =>
      isMobile
        ? (planet.satellites?.filter((s) => s.texturePath) ?? [])
        : (planet.satellites ?? []),
    [isMobile, planet.satellites]
  );

  // The tilt is a fixed Z rotation on an inner group, so the planet can spin on
  // its own Y axis and orbit the Sun without the three movements fighting.
  // The arrow and the tooltip stay outside of it so they always point up.
  const axialTiltRad = (planet.axialTilt * Math.PI) / 180;

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, axialTiltRad]}>
        <PlanetSurface
          planet={planet}
          isSelected={isSelected}
          onSelect={onSelect}
          onHover={setHovered}
          segments={sphereSegments}
        />
        {planet.id === "saturn" && <SaturnRing planetRadius={planet.relativeSize} />}
        <AtmosphereShell planet={planet} segments={sphereSegments} />
      </group>

      {satellitesToRender.map((satellite) => (
        <Satellite
          key={satellite.name}
          satellite={satellite}
          planetSize={planet.relativeSize}
          isSelected={isSelected}
        />
      ))}

      {/* Moon orbits are only drawn for the selected planet to keep the scene calm. */}
      {isSelected &&
        satellitesToRender.map((satellite) => (
          <Orbit
            key={`orbit-${satellite.name}`}
            radius={satellite.orbitRadius * planet.relativeSize}
            color={planet.baseColor}
            opacity={0.25}
            segments={64}
          />
        ))}

      {isSelected && <SelectionArrow planetRadius={planet.relativeSize} />}
      {hovered && !isSelected && <PlanetTooltip planet={planet} />}
    </group>
  );
});
