import { memo, useMemo } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Pseudo random number between 0 and 1 from a seed.
 *
 * Math.random would give a new layout on every render, so the same seed is
 * used to keep each trail in the same place for the whole session.
 */
function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Pseudo random number between min and max. */
function randomBetween(seed: number, min: number, max: number): number {
  return seededUnit(seed) * (max - min) + min;
}

/**
 * Shooting stars drawn as plain divs over the canvas, not inside the 3D scene.
 * They are skipped on phones and when the system asks for less motion.
 */

export const ShootingStarOverlay = memo(() => {
  const isMobile = useIsMobile();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Only three trails: the background already has a lot going on.
  const shootingStars = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: randomBetween(i + 10, 8, 58),
        left: randomBetween(i + 20, 8, 62),
        width: randomBetween(i + 30, 55, 100),
        angle: randomBetween(i + 40, 18, 58),
        flipX: seededUnit(i + 50) > 0.5,
        duration: randomBetween(i + 60, 14, 26),
        delay: randomBetween(i + 70, 0, 22),
      })),
    []
  );

  if (isMobile || reduceMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {shootingStars.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `rotate(${s.angle}deg)${s.flipX ? " scaleX(-1)" : ""}`,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: `${s.width}px`,
              height: "1.5px",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.72))",
              animation: `shootingStar ${s.duration}s ${s.delay}s linear infinite`,
              opacity: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
});
