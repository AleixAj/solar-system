import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Mesh, Vector3 } from "three";

const INNER_RATIO = 1.12;
const OUTER_RATIO = 2.25;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vLocalPosition;
  varying vec3 vWorldPosition;

  void main() {
    vLocalPosition = position.xy;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// The bands are built by stacking sine waves of different sizes, which is a
// cheap way to get many thin rings without a texture. The planet shadow is
// the distance from the ring point to the line that goes from the Sun (the
// center of the scene) through the planet.
const FRAGMENT_SHADER = /* glsl */ `
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uPlanetRadius;
  uniform vec3 uPlanetCenter;

  varying vec2 vLocalPosition;
  varying vec3 vWorldPosition;

  void main() {
    float radius = length(vLocalPosition);
    float t = (radius - uInnerRadius) / (uOuterRadius - uInnerRadius);
    if (t < 0.0 || t > 1.0) discard;

    float bands =
      0.58 +
      0.20 * sin(t * 34.0) +
      0.14 * sin(t * 13.0 + 1.7) +
      0.08 * sin(t * 71.0 + 0.6);

    // Cassini division: the wide dark gap you can see from Earth.
    bands *= 1.0 - 0.92 * exp(-pow((t - 0.47) / 0.035, 2.0));
    // A fainter gap near the outer edge.
    bands *= 1.0 - 0.45 * exp(-pow((t - 0.86) / 0.015, 2.0));
    // Soft inner and outer edges.
    bands *= smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.88, t);

    float density = clamp(bands, 0.0, 1.0);

    vec3 iceColor = vec3(0.98, 0.93, 0.80);
    vec3 rockColor = vec3(0.62, 0.50, 0.36);
    vec3 color = mix(rockColor, iceColor, density);

    vec3 sunDirection = normalize(uPlanetCenter);
    vec3 fromPlanet = vWorldPosition - uPlanetCenter;
    float along = dot(fromPlanet, sunDirection);
    float distanceToAxis = length(fromPlanet - sunDirection * along);
    float shadow = step(0.0, along) * smoothstep(uPlanetRadius, uPlanetRadius * 0.82, distanceToAxis);

    color *= 1.0 - 0.78 * shadow;

    gl_FragColor = vec4(color, density * 0.78);
  }
`;

/**
 * Saturn's rings.
 *
 * One flat ring drawn with a shader instead of a stack of meshes: it gives
 * hundreds of thin bands, the Cassini gap and the shadow the planet casts on
 * the rings, all in a single draw call.
 */
export const SaturnRing = memo(({ planetRadius }: { planetRadius: number }) => {
  const meshRef = useRef<Mesh>(null);
  const planetCenter = useMemo(() => new Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uInnerRadius: { value: planetRadius * INNER_RATIO },
      uOuterRadius: { value: planetRadius * OUTER_RATIO },
      uPlanetRadius: { value: planetRadius },
      uPlanetCenter: { value: new Vector3() },
    }),
    [planetRadius]
  );

  useFrame(() => {
    if (!meshRef.current) return;
    // The ring sits on the planet, so its own world position is the center of
    // the planet, which the shadow test needs.
    meshRef.current.getWorldPosition(planetCenter);
    uniforms.uPlanetCenter.value.copy(planetCenter);
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2 - 0.47, 0, 0]}>
      <ringGeometry
        args={[planetRadius * INNER_RATIO, planetRadius * OUTER_RATIO, 180, 8]}
      />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
});
