import { memo, useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";
import { useIsMobile } from "../../hooks/useIsMobile";

const DESKTOP_STAR_COUNT = 1400;
const MOBILE_STAR_COUNT = 850;
const FIELD_RADIUS = 9000;
const FIELD_DEPTH = 1200;

function createSeededRandom(seed: number): () => number {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStarGeometry(starCount: number): BufferGeometry {
  const positions = new Float32Array(starCount * 3);
  const random = createSeededRandom(20260514);

  for (let i = 0; i < starCount; i += 1) {
    const radius = FIELD_RADIUS - random() * FIELD_DEPTH;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export const StarField = memo(() => {
  const isMobile = useIsMobile();
  const starCount = isMobile ? MOBILE_STAR_COUNT : DESKTOP_STAR_COUNT;
  const geometry = useMemo(() => createStarGeometry(starCount), [starCount]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#ffffff"
        size={1.05}
        sizeAttenuation={false}
        transparent
        opacity={0.64}
        depthWrite={false}
      />
    </points>
  );
});
