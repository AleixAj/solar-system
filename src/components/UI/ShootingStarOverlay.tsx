import { memo, useMemo } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/** Igual que en mi-portfolio-3d (`StarBackground.jsx`): valores estables entre renders. */
function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function rnd(seed: number, min: number, max: number): number {
  return seededUnit(seed) * (max - min) + min;
}

export const ShootingStarOverlay = memo(() => {
  const isMobile = useIsMobile();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  /** Pocas trazas: en este proyecto el fondo ocupa mucho y 7 se notaba cargado. */
  const shootingStars = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: rnd(i + 10, 8, 58),
        left: rnd(i + 20, 8, 62),
        width: rnd(i + 30, 55, 100),
        angle: rnd(i + 40, 18, 58),
        flipX: seededUnit(i + 50) > 0.5,
        duration: rnd(i + 60, 14, 26),
        delay: rnd(i + 70, 0, 22),
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
