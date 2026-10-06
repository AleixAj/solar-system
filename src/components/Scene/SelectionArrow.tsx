import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

/**
 * Arrow floating over the selected planet so it is easy to spot.
 * It bobs up and down slowly to catch the eye without being noisy.
 */
export const SelectionArrow = memo(({ planetRadius }: { planetRadius: number }) => {
  const groupRef = useRef<Group>(null);
  const coneRadius = Math.max(planetRadius * 0.18, 0.8);
  const coneHeight = coneRadius * 2.2;
  const yOffset = planetRadius + coneHeight * 1.4;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        yOffset + Math.sin(state.clock.elapsedTime * 2.5) * coneHeight * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Rotated so the tip points down at the planet. */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[coneRadius, coneHeight, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
    </group>
  );
});
