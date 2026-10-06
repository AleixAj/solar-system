import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/**
 * Effects applied after the scene is drawn.
 *
 * Bloom makes the brightest pixels (the Sun) spill light over their
 * surroundings, which is what sells it as a star instead of an orange ball.
 * The vignette darkens the corners so the eye goes to the middle.
 *
 * Both are cheap on purpose: no multisampling, and the glow is calculated at
 * half resolution, which nobody can tell apart because it is blurred anyway.
 *

 * This file is loaded on its own so phones, which skip the effects, never
 * download the postprocessing library.
 */
export default function ScenePostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.25}
        radius={0.75}
        resolutionScale={0.5}
        mipmapBlur
      />
      <Vignette offset={0.22} darkness={0.55} />
    </EffectComposer>
  );
}
