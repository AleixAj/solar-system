import { useMemo, memo } from "react";
import { Line } from "@react-three/drei";
import type { Vector3 } from "@react-three/fiber";
import { useIsMobile } from "../../hooks/useIsMobile";

interface OrbitProps {
  radius: number;
  segments?: number;
  color?: string;
  opacity?: number;
}

/** Circular orbit line around the Sun, flat on the y = 0 plane. */
export const Orbit = memo(({
  radius,
  segments = 128,
  color = "#ffffff",
  opacity = 0.15,
}: OrbitProps) => {
  const isMobile = useIsMobile();

  const points = useMemo<Vector3[]>(() => {
    return Array.from({ length: segments + 1 }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2;
      return [radius * Math.cos(angle), 0, radius * Math.sin(angle)];
    });
  }, [radius, segments]);

  // A phone draws the scene at a lower resolution and then stretches it, and
  // it has no glow effect to help, so the same line comes out thinner and
  // fainter than on a computer. There it needs to be wider and clearer.
  const lineWidth = isMobile ? 2.2 : 1;
  const visibleOpacity = isMobile ? Math.min(opacity * 2.6, 0.55) : opacity;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={visibleOpacity}
    />
  );
});
