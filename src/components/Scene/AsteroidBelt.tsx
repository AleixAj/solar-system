import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, InstancedMesh, Object3D } from "three";
import { useSimulation } from "../../context/SimulationContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { createSeededRandom } from "../../utils/seededRandom";

// The belt sits between Mars (165) and Jupiter (225) in scene units.
const INNER_RADIUS = 180;
const OUTER_RADIUS = 212;
const HEIGHT = 7;
const DESKTOP_COUNT = 900;
const MOBILE_COUNT = 300;

/**
 * Asteroid belt between Mars and Jupiter.
 *
 * All the rocks are the same low poly shape drawn with one instanced mesh, so
 * nine hundred of them still cost a single draw call. The whole belt turns
 * as one group, which is enough to read as movement and costs nothing.
 */
export const AsteroidBelt = memo(() => {
  const isMobile = useIsMobile();
  const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const { timeScale } = useSimulation();
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const random = createSeededRandom(98765);

    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = INNER_RADIUS + random() * (OUTER_RADIUS - INNER_RADIUS);

      dummy.position.set(
        Math.cos(angle) * radius,
        (random() - 0.5) * HEIGHT,
        Math.sin(angle) * radius
      );
      dummy.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
      dummy.scale.setScalar(0.12 + random() * random() * 0.55);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0012 * timeScale * delta * 60;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        key={count}
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#9a8b79" roughness={1} metalness={0} flatShading />
      </instancedMesh>
    </group>
  );
});
