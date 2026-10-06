import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Sprite } from "three";

/** Paints a soft round gradient on a canvas, used as the glow sprite. */
function createGlowTexture(stops: [number, string][]): CanvasTexture | null {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.02,
    size / 2,
    size / 2,
    size * 0.5
  );
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new CanvasTexture(canvas);
}

/**
 * Glow around the Sun, made of two sprites: a tight bright core and a wide
 * faint corona that breathes slowly. Sprites always face the camera, so the
 * glow works from any angle and costs far less than a shader.
 */
export const SunHalo = memo(({ radius }: { radius: number }) => {
  const coronaRef = useRef<Sprite>(null);

  const coreTexture = useMemo(
    () =>
      createGlowTexture([
        [0, "rgba(255, 255, 245, 1)"],
        [0.18, "rgba(255, 216, 130, 0.6)"],
        [0.45, "rgba(255, 140, 35, 0.2)"],
        [1, "rgba(255, 110, 10, 0)"],
      ]),
    []
  );

  const coronaTexture = useMemo(
    () =>
      createGlowTexture([
        [0, "rgba(255, 220, 160, 0.22)"],
        [0.3, "rgba(255, 150, 50, 0.09)"],
        [0.6, "rgba(255, 110, 20, 0.025)"],
        [1, "rgba(255, 90, 10, 0)"],
      ]),
    []
  );

  useFrame((state) => {
    if (!coronaRef.current) return;
    // Slow breathing, so the corona never looks like a static sticker.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.45) * 0.045;
    const size = radius * 5.4 * pulse;
    coronaRef.current.scale.set(size, size, 1);
  });

  if (!coreTexture || !coronaTexture) return null;

  return (
    <>
      <sprite ref={coronaRef} scale={[radius * 5.4, radius * 5.4, 1]}>
        <spriteMaterial
          map={coronaTexture}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite scale={[radius * 3.1, radius * 3.1, 1]}>
        <spriteMaterial
          map={coreTexture}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </>
  );
});
