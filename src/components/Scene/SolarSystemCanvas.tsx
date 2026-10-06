import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CameraController } from "./CameraController";
import { INITIAL_CAMERA_POSITION } from "../../hooks/useCameraAnimation";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { Planet } from "../../types/planet";

// Loaded apart so phones, which do not use the effects, never download them.
const ScenePostProcessing = lazy(() => import("./ScenePostProcessing"));

interface SolarSystemCanvasProps {
  children?: ReactNode;
  onBackgroundClick?: () => void;
  selectedPlanet: Planet | null;
  overviewTrigger: number;
  className?: string;
}

export const SolarSystemCanvas = ({
  children,
  onBackgroundClick,
  selectedPlanet,
  overviewTrigger,
  className,
}: SolarSystemCanvasProps) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isMobile = useIsMobile();
  const isHighDpr = useMediaQuery("(min-resolution: 2dppx)");

  // Turns true when the computer cannot keep a smooth frame rate. From then on
  // the scene is drawn at a lower resolution, which is the cheapest thing to
  // give away: fewer pixels to paint, same look.
  const [struggling, setStruggling] = useState(false);
  const onDecline = useCallback(() => {
    // A tab in the background draws almost no frames, and that looks exactly
    // like a slow computer. Only trust the measurement while it is on screen.
    if (document.visibilityState !== "visible") return;
    setStruggling(true);
  }, []);

  const dpr = useMemo<[number, number]>(() => {
    if (struggling) return [0.6, 0.85];
    if (isMobile) return [1, 1.1];
    return isHighDpr ? [1, 1.4] : [1, 1.25];
  }, [isHighDpr, isMobile, struggling]);

  const cameraConfig = useMemo(
    () => ({
      position: INITIAL_CAMERA_POSITION.toArray() as [number, number, number],
      fov: 75,
      near: 0.1,
      far: 100000,
    }),
    []
  );

  return (
    <Canvas
      className={className}
      camera={cameraConfig}
      dpr={dpr}
      performance={{ min: 0.5 }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* Black space background */}
      <color attach="background" args={["#000000"]} />

      {/* Watches the frame rate. If it drops, quality goes down once and stays
          down, instead of flickering between settings. */}
      <PerformanceMonitor bounds={() => [45, 60]} onDecline={onDecline} />

      {/* Orbit Controls for camera navigation */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={50}
        maxDistance={1400}
      />

      {/* Drives smooth camera transitions when selection changes */}
      <CameraController
        controlsRef={controlsRef}
        selectedPlanet={selectedPlanet}
        overviewTrigger={overviewTrigger}
      />

      {/* Big invisible plane behind the scene: clicking it clears the selection. */}
      <mesh
        position={[0, 0, -500]}
        onClick={onBackgroundClick}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
      </mesh>

      {children}

      {/* The glow around the Sun and the darkened corners are added after the
          scene is drawn. Phones and slow computers skip them. */}
      {!isMobile && (
        <Suspense fallback={null}>
          <ScenePostProcessing />
        </Suspense>
      )}
    </Canvas>
  );
};
