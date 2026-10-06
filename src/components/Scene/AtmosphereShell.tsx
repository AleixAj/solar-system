import { memo, useMemo } from "react";
import { AdditiveBlending, BackSide, Color } from "three";
import type { Planet as PlanetType } from "../../types/planet";

/** Color and strength of the haze around the planets that have one. */
function getAtmosphere(planetId: string) {
  switch (planetId) {
    case "earth":
      return { color: "#6cc5ff", intensity: 1.15, power: 2.6, scale: 1.055 };
    case "venus":
      return { color: "#ffd089", intensity: 0.95, power: 2.2, scale: 1.05 };
    case "mars":
      return { color: "#ff9a6b", intensity: 0.5, power: 3.2, scale: 1.04 };
    case "uranus":
      return { color: "#8ff4ff", intensity: 0.7, power: 2.8, scale: 1.045 };
    case "neptune":
      return { color: "#7c9bff", intensity: 0.8, power: 2.8, scale: 1.045 };
    case "jupiter":
      return { color: "#ffd9a8", intensity: 0.35, power: 3.4, scale: 1.03 };
    case "saturn":
      return { color: "#ffe6b0", intensity: 0.3, power: 3.4, scale: 1.03 };
    default:
      return null;
  }
}

// Only the rim of the sphere glows. The trick is the angle between the surface
// and the camera: head on it is 0, at the edge it is 1. That is the same shape
// of light you see around a real planet seen from space.
const VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    vec4 viewPosition = viewMatrix * worldPosition;
    vViewPosition = viewPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewPosition;
  }
`;

// The Sun sits at the center of the scene, so the direction to the light is
// simply the direction from the fragment back to the origin. That lets the
// haze fade out on the night side instead of ringing the whole planet.
const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDirection = normalize(-vViewPosition);
    // The sphere is drawn from the inside, so the normal points away from the
    // camera. abs() keeps the edge test working all the same.
    float rim = 1.0 - abs(dot(viewDirection, normalize(vViewNormal)));
    rim = pow(clamp(rim, 0.0, 1.0), uPower);

    vec3 toSun = normalize(-vWorldPosition);
    float dayLight = clamp(dot(vWorldNormal, toSun) * 1.6 + 0.35, 0.0, 1.0);

    gl_FragColor = vec4(uColor, rim * dayLight * uIntensity);
  }
`;

/**
 * Glow around a planet that stands in for its atmosphere.
 *
 * It is a slightly bigger sphere drawn from the inside, with a shader that
 * only lights up the edge and only on the side facing the Sun.
 */
export const AtmosphereShell = memo(
  ({ planet, segments }: { planet: PlanetType; segments: number }) => {
    const atmosphere = getAtmosphere(planet.id);

    const uniforms = useMemo(
      () => ({
        uColor: { value: new Color(atmosphere?.color ?? "#ffffff") },
        uIntensity: { value: atmosphere?.intensity ?? 0 },
        uPower: { value: atmosphere?.power ?? 3 },
      }),
      [atmosphere?.color, atmosphere?.intensity, atmosphere?.power]
    );

    if (!atmosphere) return null;

    return (
      <mesh scale={atmosphere.scale}>
        <sphereGeometry args={[planet.relativeSize, segments, segments]} />
        <shaderMaterial
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          side={BackSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    );
  }
);
