import { memo } from "react";
import { Html } from "@react-three/drei";

interface SceneTooltipProps {
  /** Height above the center of the body, in scene units. */
  y: number;
  title: string;
  /** Extra line under the title, used for the diameter of planets and the Sun. */
  subtitle?: string;
  titleColor?: string;
  borderColor?: string;
  /** CSS box-shadow used as a soft glow. Moons do not use it. */
  glow?: string;
}

/**
 * Small label that follows a body in the scene while the pointer is over it.
 *
 * It is plain HTML on top of the Canvas (drei's Html), so the text stays sharp
 * and does not need a 3D font. Moons show only a name, so they get a smaller
 * box than planets and the Sun.
 */
export const SceneTooltip = memo(
  ({
    y,
    title,
    subtitle,
    titleColor = "#ffffff",
    borderColor = "rgba(255,255,255,0.2)",
    glow,
  }: SceneTooltipProps) => {
    const compact = !subtitle;

    return (
      <Html center position={[0, y, 0]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(8, 14, 30, 0.92)",
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: compact ? "4px 10px" : "6px 12px",
            backdropFilter: "blur(10px)",
            whiteSpace: "nowrap",
            textAlign: "center",
            boxShadow: glow,
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: titleColor,
              fontWeight: 700,
              fontSize: compact ? "12px" : "13px",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "11px",
                fontFamily: "monospace",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </Html>
    );
  }
);
