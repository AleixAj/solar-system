import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useSimulation } from "../context/SimulationContext";

/**
 * Moves a group in a circle on the XZ plane around its parent.
 *
 * Used both for planets orbiting the Sun and for moons orbiting a planet.
 * `priority` is passed to useFrame: planets use -1 so they move before the
 * camera reads their position in the same frame.
 */
export function useOrbitPosition(
  radius: number,
  speed: number,
  initialAngle: number,
  priority = 0
) {
  const groupRef = useRef<Group>(null);
  const angleRef = useRef(initialAngle);
  const { timeScale } = useSimulation();

  useFrame((_, delta) => {
    angleRef.current += speed * timeScale * delta * 60;
    if (groupRef.current) {
      groupRef.current.position.set(
        radius * Math.cos(angleRef.current),
        0,
        radius * Math.sin(angleRef.current)
      );
    }
  }, priority);

  return groupRef;
}
