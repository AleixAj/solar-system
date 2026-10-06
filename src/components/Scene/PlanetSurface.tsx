import { Suspense } from "react";
import { useTexture } from "@react-three/drei";
import type { Texture } from "three";
import type { Planet as PlanetType } from "../../types/planet";
import { useSelfRotation } from "../../hooks/useSelfRotation";
import { pointerCursorProps } from "./pointerCursor";

interface PlanetSurfaceProps {
  planet: PlanetType;
  isSelected?: boolean;
  onSelect?: (planet: PlanetType) => void;
  onHover?: (hovered: boolean) => void;
  segments: number;
}

/**
 * Material values per planet family, so a rocky planet does not look like a
 * gas giant. Selected planets get a tiny extra glow to stand out.
 */
function getSurfaceMaterial(planet: PlanetType, isSelected?: boolean) {
  const selectedBoost = isSelected ? 0.055 : 0;

  switch (planet.type) {
    case "terrestrial":
      return {
        metalness: 0.02,
        roughness: planet.id === "earth" ? 0.72 : 0.9,
        emissiveIntensity: selectedBoost,
      };
    case "gas-giant":
      return {
        metalness: 0,
        roughness: 0.82,
        emissiveIntensity: 0.012 + selectedBoost,
      };
    case "ice-giant":
      return {
        metalness: 0,
        roughness: 0.58,
        emissiveIntensity: 0.025 + selectedBoost,
      };
    default:
      return {
        metalness: 0.05,
        roughness: 0.75,
        emissiveIntensity: selectedBoost,
      };
  }
}

/** The planet sphere itself. Without a texture it shows its base color. */
const SurfaceMesh = ({
  planet,
  isSelected,
  onSelect,
  onHover,
  segments,
  texture,
}: PlanetSurfaceProps & { texture?: Texture }) => {
  const meshRef = useSelfRotation(planet.rotationSpeed);
  const material = getSurfaceMaterial(planet, isSelected);

  return (
    <mesh
      ref={meshRef}
      // The camera finds the planet in the scene by this name.
      name={planet.id}
      onClick={() => onSelect?.(planet)}
      {...pointerCursorProps(onHover)}
    >
      <sphereGeometry args={[planet.relativeSize, segments, segments]} />
      <meshStandardMaterial
        map={texture ?? null}
        color={texture ? "#f7f7f7" : planet.baseColor}
        metalness={material.metalness}
        roughness={material.roughness}
        emissive={planet.baseColor}
        emissiveIntensity={material.emissiveIntensity}
      />
    </mesh>
  );
};

/** Loads the texture. useTexture suspends, so it needs its own component. */
const TexturedSurfaceMesh = (props: PlanetSurfaceProps) => {
  const texture = useTexture(props.planet.texture!);
  return <SurfaceMesh {...props} texture={texture} />;
};

export const PlanetSurface = (props: PlanetSurfaceProps) => {
  // The flat sphere shows for a moment while the texture downloads, so it
  // skips the selection glow.
  const flatSphere = <SurfaceMesh {...props} isSelected={false} />;

  if (!props.planet.texture) return flatSphere;

  return (
    <Suspense fallback={flatSphere}>
      <TexturedSurfaceMesh {...props} />
    </Suspense>
  );
};
