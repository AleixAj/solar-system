import { memo, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";
import { useIsMobile } from "../../hooks/useIsMobile";
import { createSeededRandom } from "../../utils/seededRandom";

const FIELD_RADIUS = 9000;
const FIELD_DEPTH = 1500;

/** Layers of stars: a few big and bright ones, many small and faint ones. */
const LAYERS = [
  { seed: 20260514, count: 120, size: 2.6, opacity: 0.95, color: "#ffffff" },
  { seed: 77010203, count: 420, size: 1.6, opacity: 0.75, color: "#dfe9ff" },
  { seed: 31415926, count: 900, size: 1.0, opacity: 0.5, color: "#cfd8ef" },
];

/** Spreads points evenly over a sphere around the scene. */
function createStarGeometry(count: number, seed: number): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const random = createSeededRandom(seed);

  for (let i = 0; i < count; i += 1) {
    const radius = FIELD_RADIUS - random() * FIELD_DEPTH;
    const theta = random() * Math.PI * 2;
    // acos of an even value keeps the points from bunching up at the poles.
    const phi = Math.acos(2 * random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

/**
 * Sharp stars drawn on top of the background photo, which is blurry by
 * itself. Three layers of different size and brightness give the sky some
 * depth. On phones each layer uses fewer stars.
 */
export const StarField = memo(() => {
  const isMobile = useIsMobile();

  const layers = useMemo(
    () =>
      LAYERS.map((layer) => ({
        ...layer,
        geometry: createStarGeometry(
          Math.round(layer.count * (isMobile ? 0.45 : 1)),
          layer.seed
        ),
      })),
    [isMobile]
  );

  return (
    <>
      {layers.map((layer) => (
        <points key={layer.seed} geometry={layer.geometry} frustumCulled={false}>
          <pointsMaterial
            color={layer.color}
            size={layer.size}
            sizeAttenuation={false}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </points>
      ))}
    </>
  );
});
