import { memo, useMemo } from "react";
import { AdditiveBlending, CanvasTexture } from "three";

/**
 * Glow around the Sun.
 *
 * The gradient is painted once on a 2D canvas and used as a sprite, which is
 * much cheaper than a shader and hides the hard edge of the sphere.
 */
export const SunHalo = memo(({ radius }: { radius: number }) => {
  const haloTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.04,
      size / 2,
      size / 2,
      size * 0.5
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
