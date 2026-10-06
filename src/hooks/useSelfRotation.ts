import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useSimulation } from "../context/SimulationContext";

/**
 * Spins a mesh around its own Y axis.
 *
 * The speed is multiplied by delta * 60 so the movement looks the same on a
 * 30 fps and a 144 fps screen. A negative speed spins the other way.
 */
export function useSelfRotation(speed: number) {
  const meshRef = useRef<Mesh>(null);
  const { timeScale } = useSimulation();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed * timeScale * delta * 60;
    }
  });

  return meshRef;
}
