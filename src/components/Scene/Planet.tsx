import { useRef, Suspense, useState, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import { AdditiveBlending, BackSide, DoubleSide, Mesh, Group } from "three";
import type { Planet as PlanetType } from "../../types/planet";
import { planets } from "../../data/planets";
import { getOrbitRadius } from "../../utils/orbitUtils";
import { useSimulation } from "../../context/SimulationContext";
import { useLanguage } from "../../context/LanguageContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Satellite } from "./Satellite";
import { Orbit } from "./Orbit";

// Preload planet textures at module load time so they start downloading before
// any Planet component mounts. Satellite textures are intentionally excluded —
// they are not visible until a planet is selected, so deferring them reduces
// the initial network payload and improves FCP/LCP on slow connections.
planets.forEach((p) => {
  if (p.texture) useTexture.preload(p.texture);
});

interface PlanetComponentProps {
  planet: PlanetType;
  index: number;
  onSelect?: (planet: PlanetType) => void;
  isSelected?: boolean;
}

interface PlanetMeshProps {
  planet: PlanetType;
  isSelected?: boolean;
  onSelect?: (planet: PlanetType) => void;
  onHover?: (hovered: boolean) => void;
  segments?: number;
}

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

function getAtmosphere(planet: PlanetType): { color: string; opacity: number; scale: number } | null {
  switch (planet.id) {
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

const AtmosphereShell = memo(({ planet, segments }: { planet: PlanetType; segments: number }) => {
  const atmosphere = getAtmosphere(planet);
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
});

/** Inner mesh that loads and applies the planet texture via Suspense. */
const PlanetTexturedMesh = ({
  planet,
  isSelected,
  onSelect,
  onHover,
  segments = 32,
}: PlanetMeshProps) => {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(planet.texture!);
  const { timeScale } = useSimulation();
  const material = getSurfaceMaterial(planet, isSelected);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y +=
        planet.rotationSpeed * timeScale * delta * 60;
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={planet.id}
      onClick={() => onSelect?.(planet)}
      onPointerEnter={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.(true);
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
        onHover?.(false);
      }}
    >
      <sphereGeometry args={[planet.relativeSize, segments, segments]} />
      <meshStandardMaterial
        map={texture}
        color="#f7f7f7"
        metalness={material.metalness}
        roughness={material.roughness}
        emissive={planet.baseColor}
        emissiveIntensity={material.emissiveIntensity}
      />
    </mesh>
  );
};

/** Fallback mesh rendered while texture is loading or when no texture is available. */
const PlanetFallbackMesh = ({ planet, onSelect, onHover, segments = 32 }: PlanetMeshProps) => {
  const meshRef = useRef<Mesh>(null);
  const { timeScale } = useSimulation();
  const material = getSurfaceMaterial(planet);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y +=
        planet.rotationSpeed * timeScale * delta * 60;
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={planet.id}
      onClick={() => onSelect?.(planet)}
      onPointerEnter={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.(true);
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
        onHover?.(false);
      }}
    >
      <sphereGeometry args={[planet.relativeSize, segments, segments]} />
      <meshStandardMaterial
        color={planet.baseColor}
        metalness={material.metalness}
        roughness={material.roughness}
        emissive={planet.baseColor}
        emissiveIntensity={material.emissiveIntensity}
      />
    </mesh>
  );
};

/**
 * Small downward-pointing arrow above the selected planet.
 * Bobs gently up and down to draw attention without overwhelming the scene.
 */
const SelectionArrow = memo(({ planet }: { planet: PlanetType }) => {
  const groupRef = useRef<Group>(null);
  const coneRadius = Math.max(planet.relativeSize * 0.18, 0.8);
  const coneHeight = coneRadius * 2.2;
  // Position the tip just above the planet surface with a small gap
  const yOffset = planet.relativeSize + coneHeight * 1.4;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle vertical bob: ±coneHeight * 0.4 over ~2 seconds
      groupRef.current.position.y =
        yOffset + Math.sin(state.clock.elapsedTime * 2.5) * coneHeight * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Cone pointing downward (rotate 180° on Z or flip via PI on X) */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[coneRadius, coneHeight, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
    </group>
  );
});

/** Saturn's iconic ring system — several cheap transparent bands for a textured feel. */
const SaturnRing = memo(({ planetRadius }: { planetRadius: number }) => {
  const tilt: [number, number, number] = [Math.PI / 2 - 0.47, 0, 0];
  const bands = [
    { inner: 1.12, outer: 1.28, color: "#f7e0a3", opacity: 0.48 },
    { inner: 1.34, outer: 1.55, color: "#c8a46d", opacity: 0.58 },
    { inner: 1.62, outer: 1.86, color: "#f0d89a", opacity: 0.5 },
    { inner: 1.94, outer: 2.18, color: "#8f7654", opacity: 0.32 },
  ];

  return (
    <group rotation={tilt}>
      {bands.map((band) => (
        <mesh key={`${band.inner}-${band.outer}`}>
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
  );
});

/** Tooltip shown on hover above the planet. */
const PlanetTooltip = memo(({ planet }: { planet: PlanetType }) => {
  const { getPlanetName } = useLanguage();

  return (
    <Html
      center
      position={[0, planet.relativeSize + 1.8, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          background: "rgba(8, 14, 30, 0.92)",
          border: `1px solid ${planet.baseColor}55`,
          borderRadius: "8px",
          padding: "6px 12px",
          backdropFilter: "blur(10px)",
          whiteSpace: "nowrap",
          textAlign: "center",
          boxShadow: `0 0 12px ${planet.baseColor}33`,
          userSelect: "none",
        }}
      >
        <div
          style={{
            color: planet.baseColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.04em",
          }}
        >
          {getPlanetName(planet)}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "11px",
            fontFamily: "monospace",
            marginTop: "2px",
          }}
        >
          ⌀ {planet.diameter.toLocaleString()} km
        </div>
      </div>
    </Html>
  );
});

export const Planet = memo(
  ({ planet, index, onSelect, isSelected }: PlanetComponentProps) => {
    const groupRef = useRef<Group>(null);
    const { timeScale } = useSimulation();
    const isMobile = useIsMobile();
    const orbitRadius = getOrbitRadius(planet.distanceFromSun, planet.id);
    const initialAngle = (index * Math.PI * 2) / 8;
    const angleRef = useRef(initialAngle);
    const [hovered, setHovered] = useState(false);

    // Reduce sphere complexity on mobile to improve GPU performance
    const sphereSegments = isMobile ? 24 : 32;

    // On mobile render only satellites that have a texture (skip plain-color ones)
    const satellitesToRender = useMemo(
      () =>
        isMobile
          ? (planet.satellites?.filter((s) => s.texturePath) ?? [])
          : (planet.satellites ?? []),
      [isMobile, planet.satellites]
    );

    useFrame((_, delta) => {
      angleRef.current += planet.orbitSpeed * timeScale * delta * 60;
      if (groupRef.current) {
        groupRef.current.position.set(
          orbitRadius * Math.cos(angleRef.current),
          0,
          orbitRadius * Math.sin(angleRef.current),
        );
      }
    }, -1);

    const meshProps: PlanetMeshProps = {
      planet,
      isSelected,
      onSelect,
      onHover: setHovered,
      segments: sphereSegments,
    };

    // Axial tilt applied as a static Z rotation on the inner group so the
    // self-rotation (Y axis in mesh) and orbital movement (outer group) remain
    // independent. SelectionArrow and Tooltip stay outside so they always
    // point "up" in scene coordinates regardless of tilt.
    const axialTiltRad = (planet.axialTilt * Math.PI) / 180;

    return (
      <group ref={groupRef}>
        <group rotation={[0, 0, axialTiltRad]}>
          {planet.texture ? (
            <Suspense fallback={<PlanetFallbackMesh {...meshProps} />}>
              <PlanetTexturedMesh {...meshProps} />
            </Suspense>
          ) : (
            <PlanetFallbackMesh {...meshProps} />
          )}
          {planet.id === "saturn" && (
            <SaturnRing planetRadius={planet.relativeSize} />
          )}
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
        {isSelected && satellitesToRender.map((satellite) => (
          <Orbit
            key={`orbit-${satellite.name}`}
            radius={satellite.orbitRadius * planet.relativeSize}
            color={planet.baseColor}
            opacity={0.25}
            segments={64}
          />
        ))}
        {isSelected && <SelectionArrow planet={planet} />}
        {hovered && !isSelected && <PlanetTooltip planet={planet} />}
      </group>
    );
  },
);
