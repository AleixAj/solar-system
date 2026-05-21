import { useRef, Suspense, memo, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, Mesh } from "three";
import { useSimulation } from "../../context/SimulationContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Planet } from "../../types/planet";

interface SunProps {
  sun: Planet;
  onSelect?: (planet: Planet) => void;
  onHover?: (hovered: boolean) => void;
}

const SunHalo = memo(({ radius }: { radius: number }) => {
  const haloTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) return null;

    // Radial alpha falloff keeps the glow soft instead of showing hard sphere edges.
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.04,
      size / 2,
      size / 2,
      size * 0.5,
    );

    gradient.addColorStop(0, "rgba(255, 248, 174, 0.65)");
    gradient.addColorStop(0.25, "rgba(255, 183, 56, 0.34)");
    gradient.addColorStop(0.55, "rgba(255, 119, 18, 0.14)");
    gradient.addColorStop(1, "rgba(255, 119, 18, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return new CanvasTexture(canvas);
  }, []);

  if (!haloTexture) return null;

  return (
    <sprite scale={[radius * 4.2, radius * 4.2, 1]}>
      <spriteMaterial
        map={haloTexture}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
});

const SunTexturedMesh = ({ sun, onSelect, onHover }: SunProps) => {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(sun.texture!);
  const { timeScale } = useSimulation();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += sun.rotationSpeed * timeScale * delta * 60;
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={sun.id}
      position={[0, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(sun);
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.(true);
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
        onHover?.(false);
      }}
    >
      <sphereGeometry args={[sun.relativeSize, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive={sun.baseColor}
        emissiveIntensity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
};

const SunFallbackMesh = ({ sun, onSelect, onHover }: SunProps) => (
  <mesh
    name={sun.id}
    position={[0, 0, 0]}
    onClick={(event) => {
      event.stopPropagation();
      onSelect?.(sun);
    }}
    onPointerEnter={(event) => {
      event.stopPropagation();
      document.body.style.cursor = "pointer";
      onHover?.(true);
    }}
    onPointerLeave={() => {
      document.body.style.cursor = "auto";
      onHover?.(false);
    }}
  >
    <sphereGeometry args={[sun.relativeSize, 64, 64]} />
    <meshBasicMaterial color={sun.baseColor} toneMapped={false} />
  </mesh>
);

const SunTooltip = memo(({ sun }: { sun: Planet }) => {
  const { getPlanetName } = useLanguage();

  return (
    <Html
      center
      position={[0, sun.relativeSize + 2.2, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          background: "rgba(8, 14, 30, 0.92)",
          border: `1px solid ${sun.baseColor}66`,
          borderRadius: "8px",
          padding: "6px 12px",
          backdropFilter: "blur(10px)",
          whiteSpace: "nowrap",
          textAlign: "center",
          boxShadow: `0 0 16px ${sun.baseColor}44`,
          userSelect: "none",
        }}
      >
        <div
          style={{
            color: sun.baseColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.04em",
          }}
        >
          {getPlanetName(sun)}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "11px",
            fontFamily: "monospace",
            marginTop: "2px",
          }}
        >
          ⌀ {sun.diameter.toLocaleString()} km
        </div>
      </div>
    </Html>
  );
});

export const Sun = memo(({ sun, onSelect }: SunProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <SunHalo radius={sun.relativeSize} />
      <Suspense fallback={<SunFallbackMesh sun={sun} onSelect={onSelect} onHover={setHovered} />}>
        <SunTexturedMesh sun={sun} onSelect={onSelect} onHover={setHovered} />
      </Suspense>
      {hovered && <SunTooltip sun={sun} />}
    </>
  );
});
