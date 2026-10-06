import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/**
 * Effects applied after the scene is drawn.
 *
 * Bloom makes the brightest pixels (the Sun) spill light over their
 * surroundings, which is what sells it as a star instead of an orange ball.
 * The vignette darkens the corners so the eye goes to the middle.
 *
 * This file is loaded on its own so phones, which skip the effects, never
 * download the postprocessing library.
 */
export default function ScenePostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.25}
        radius={0.75}
        mipmapBlur
      />
      <Vignette offset={0.22} darkness={0.55} />
    </EffectComposer>
  );
}
