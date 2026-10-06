import { Suspense, memo, useState } from "react";
import { useTexture } from "@react-three/drei";
import type { Texture } from "three";
import { useLanguage } from "../../context/LanguageContext";
import { useSelfRotation } from "../../hooks/useSelfRotation";
import type { Planet } from "../../types/planet";
import { SceneTooltip } from "./SceneTooltip";
import { SunHalo } from "./SunHalo";
import { pointerCursorProps } from "./pointerCursor";

interface SunProps {
  sun: Planet;
  onSelect?: (planet: Planet) => void;
}

interface SunSphereProps extends SunProps {
  onHover?: (hovered: boolean) => void;
  texture?: Texture;
}

/**
 * The Sun sphere.
 *
 * It uses a material that ignores the scene lights, because the Sun is the
 * light source: it must stay fully bright on every side. Tone mapping is off
 * too, so it keeps its brightness and the bloom effect picks it up.
 */
const SunSphere = ({ sun, onSelect, onHover, texture }: SunSphereProps) => {
  const meshRef = useSelfRotation(sun.rotationSpeed);

  return (
    <mesh
      ref={meshRef}
      name={sun.id}
      position={[0, 0, 0]}
      onClick={(event) => {
        // Without this the click also reaches the background mesh, which
        // would deselect the Sun right after selecting it.
        event.stopPropagation();
        onSelect?.(sun);
      }}
      {...pointerCursorProps(onHover)}
    >
      <sphereGeometry args={[sun.relativeSize, 64, 64]} />
      <meshBasicMaterial
        map={texture ?? null}
        // Brighter than white on purpose: that is what makes the bloom
        // effect treat the Sun as a light source.
        color={texture ? "#ffffff" : sun.baseColor}
        toneMapped={false}
      />
    </mesh>
  );
};

/** Loads the texture. useTexture suspends, so it needs its own component. */
const TexturedSunSphere = (props: SunSphereProps) => {
  const texture = useTexture(props.sun.texture!);
  return <SunSphere {...props} texture={texture} />;
};

/** Kept apart from Sun so only this label redraws when the language changes. */
const SunTooltip = memo(({ sun }: { sun: Planet }) => {
  const { getPlanetName } = useLanguage();

  return (
    <SceneTooltip
      y={sun.relativeSize + 2.2}
      title={getPlanetName(sun)}
      subtitle={`⌀ ${sun.diameter.toLocaleString()} km`}
      titleColor={sun.baseColor}
      borderColor={`${sun.baseColor}66`}
      glow={`0 0 16px ${sun.baseColor}44`}
    />
  );
});

export const Sun = memo(({ sun, onSelect }: SunProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <SunHalo radius={sun.relativeSize} />
      <Suspense fallback={<SunSphere sun={sun} onSelect={onSelect} onHover={setHovered} />}>
        <TexturedSunSphere sun={sun} onSelect={onSelect} onHover={setHovered} />
      </Suspense>
      {hovered && <SunTooltip sun={sun} />}
    </>
  );
});
