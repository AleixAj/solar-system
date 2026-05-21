import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { ReactNode } from "react";
import { Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CameraController } from "./CameraController";
import { INITIAL_CAMERA_POSITION } from "../../hooks/useCameraAnimation";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { Planet } from "../../types/planet";

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
  const backgroundRef = useRef<Mesh>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isHighDpr = useMediaQuery("(min-resolution: 2dppx)");
  const dpr = useMemo<[number, number]>(
    () => (isMobile ? [1, 1.25] : isHighDpr ? [1, 1.6] : [1, 1.35]),
    [isHighDpr, isMobile]
  );
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

      {/* Orbit Controls for camera navigation */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={50}
        maxDistance={1400}
      />

      {/* Drives smooth camera transitions when selection changes */}
      <CameraController
        controlsRef={controlsRef}
        selectedPlanet={selectedPlanet}
        overviewTrigger={overviewTrigger}
      />

      {/* Background plane to capture deselection clicks */}
      <mesh
        ref={backgroundRef}
        position={[0, 0, -500]}
        onClick={onBackgroundClick}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
      </mesh>

      {/* Children components will be rendered here */}
      {children}
    </Canvas>
  );
};
