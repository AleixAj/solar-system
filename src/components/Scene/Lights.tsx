import { memo } from "react";

/**
 * Lighting of the scene.
 *
 * Almost all the light comes from a single point at the Sun, so every planet
 * has a lit side and a dark side with a real terminator between them. Its
 * decay is turned off on purpose: with a real falloff Neptune would be pitch
 * black at this scale. The faint ambient light only keeps the night side from
 * going fully black.
 */
export const Lights = memo(() => (
  <>
    <ambientLight intensity={0.07} />

    <pointLight
      position={[0, 0, 0]}
      intensity={3.4}
      distance={0}
      decay={0}
      color="#fff4e0"
    />
  </>
));
