import { memo, useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Group } from "three";

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// The glow is calculated per pixel instead of stretching a small image, so it
// stays smooth no matter how close the camera gets. The tiny bit of noise at
// the end hides the steps that appear when a very soft gradient is stored in
// only 256 levels of brightness.
const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uInnerColor;
  uniform vec3 uOuterColor;
  uniform float uIntensity;
  uniform float uFalloff;

  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float distance = length(vUv - 0.5) * 2.0;
    if (distance > 1.0) discard;

    float glow = pow(1.0 - distance, uFalloff);
    vec3 color = mix(uOuterColor, uInnerColor, smoothstep(0.0, 0.8, glow));
    float dither = (noise(gl_FragCoord.xy) - 0.5) / 180.0;

    gl_FragColor = vec4(color, clamp(glow * uIntensity + dither, 0.0, 1.0));
  }
`;

interface GlowProps {
  size: number;
  innerColor: string;
  outerColor: string;
  intensity: number;
  falloff: number;
}

/** A flat circle of light that always faces the camera. */
const Glow = ({ size, innerColor, outerColor, intensity, falloff }: GlowProps) => {
  const uniforms = useMemo(
    () => ({
      uInnerColor: { value: new Color(innerColor) },
      uOuterColor: { value: new Color(outerColor) },
      uIntensity: { value: intensity },
      uFalloff: { value: falloff },
    }),
    [innerColor, outerColor, intensity, falloff]
  );

  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

/**
 * Glow around the Sun, in two layers: a tight bright core and a wide faint
 * corona that breathes slowly.
 */
export const SunHalo = memo(({ radius }: { radius: number }) => {
  const coronaRef = useRef<Group>(null);

  useFrame((state) => {
    if (!coronaRef.current) return;
    // Slow breathing, so the corona never looks like a static sticker.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.45) * 0.045;
    coronaRef.current.scale.setScalar(pulse);
  });

  return (
    <Billboard>
      <group ref={coronaRef}>
        <Glow
          size={radius * 6.5}
          innerColor="#ffb257"
          outerColor="#ff5a0a"
          intensity={0.4}
          falloff={2.6}
        />
      </group>
      <Glow
        size={radius * 3.2}
        innerColor="#fffbe8"
        outerColor="#ff8c22"
        intensity={0.95}
        falloff={2.1}
      />
    </Billboard>
  );
});
