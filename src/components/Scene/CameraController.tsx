import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useCameraAnimation } from "../../hooks/useCameraAnimation";
import type { Planet } from "../../types/planet";

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  selectedPlanet: Planet | null;
  /** Increment to trigger a camera reset regardless of selectedPlanet state. */
  overviewTrigger: number;
}

/**
 * How far the camera sits from a planet. Saturn needs more room because of
 * its rings, and small planets get a minimum distance so they stay visible.
 */
function getCameraOffset(planet: Planet): { lateral: number; vertical: number } {
  const viewRadius =
    planet.id === "saturn" ? planet.relativeSize * 2.2 : planet.relativeSize;

  const lateral = Math.max(viewRadius * 4.5 + 15, 30);
  const vertical = planet.relativeSize * 1.5;

  return { lateral, vertical };
}

/**
 * Moves the camera when the selected planet changes.
 *
 * It lives inside <Canvas> so it can run code on every frame. After the fly-to
 * animation lands, two things happen on each frame:
 *
 * 1. Follow the orbit. The planet keeps moving, so the step it took is added
 *    to the camera and to the point the camera looks at. That way the viewing
 *    angle and the distance stay the same.
 *
 * 2. Fix the aim. The flight was aimed at the spot where the planet was when
 *    it got picked, and the planet moved during those 1.4 seconds. The gap
 *    left over is closed in about half a second instead of jumping.
 */
export function CameraController({
  controlsRef,
  selectedPlanet,
  overviewTrigger,
}: CameraControllerProps) {
  const { scene, camera } = useThree();
  const { moveTo, updateTarget, resetView, isAnimating } = useCameraAnimation(controlsRef);

  const isFirstRender = useRef(true);
  /** Planet world-position recorded on the previous frame for delta calculation. */
  const prevPlanetPosRef = useRef<Vector3 | null>(null);
  const currentPlanetPosRef = useRef(new Vector3());
  const liveCameraTargetRef = useRef(new Vector3());
  const orbitDeltaRef = useRef(new Vector3());
  const correctionRef = useRef(new Vector3());
  /** Planet id associated with prevPlanetPosRef. Prevents cross-planet deltas. */
  const trackedPlanetIdRef = useRef<string | null>(null);
  /** Detects the frame the fly-to animation finishes. */
  const wasAnimatingRef = useRef(false);
  /**
   * Gap between the OrbitControls target and the planet's actual position
   * at the moment the fly-to animation lands. Closed gradually over ~0.5 s.
   */
  const alignmentGapRef = useRef<Vector3 | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!selectedPlanet) {
      prevPlanetPosRef.current = null;
      trackedPlanetIdRef.current = null;
      alignmentGapRef.current = null;
      if (controlsRef.current) controlsRef.current.autoRotate = false;
      resetView();
      return;
    }

    // A planet change starts a fresh fly-to. Keep the previous planet's orbit
    // tracking delta from being applied to the new target for one frame.
    prevPlanetPosRef.current = null;
    trackedPlanetIdRef.current = selectedPlanet.id;
    alignmentGapRef.current = null;

    const planetMesh = scene.getObjectByName(selectedPlanet.id);
    if (!planetMesh) return;

    const planetPos = new Vector3();
    planetMesh.getWorldPosition(planetPos);

    const { lateral, vertical } = getCameraOffset(selectedPlanet);
    const cameraPos = new Vector3(
      planetPos.x + lateral,
      planetPos.y + vertical,
      planetPos.z + lateral
    );

    moveTo(cameraPos, planetPos.clone(), {
      minDistance: Math.max(selectedPlanet.relativeSize * 1.5, 5),
      maxDistance: lateral * 4,
    });
  }, [controlsRef, selectedPlanet, scene, moveTo, resetView]);

  useEffect(() => {
    if (overviewTrigger === 0) return;
    prevPlanetPosRef.current = null;
    trackedPlanetIdRef.current = null;
    alignmentGapRef.current = null;
    if (controlsRef.current) controlsRef.current.autoRotate = false;
    resetView();
  }, [controlsRef, overviewTrigger, resetView]);

  useFrame((_, delta) => {
    const animationJustEnded = wasAnimatingRef.current && !isAnimating;
    wasAnimatingRef.current = isAnimating;

    if (!selectedPlanet || !controlsRef.current) return;
    controlsRef.current.autoRotate = false;

    const planetMesh = scene.getObjectByName(selectedPlanet.id);
    if (!planetMesh) return;

    const currentPos = currentPlanetPosRef.current;
    planetMesh.getWorldPosition(currentPos);

    if (isAnimating) {
      // Keep the destination glued to the moving planet. Without this the
      // camera would land where the planet was when the flight started.
      const { lateral, vertical } = getCameraOffset(selectedPlanet);
      liveCameraTargetRef.current.set(
        currentPos.x + lateral,
        currentPos.y + vertical,
        currentPos.z + lateral
      );
      updateTarget(
        liveCameraTargetRef.current,
        currentPos
      );
      return;
    }

    if (
      animationJustEnded ||
      !prevPlanetPosRef.current ||
      trackedPlanetIdRef.current !== selectedPlanet.id
    ) {
      // The flight just landed. Save how far the planet has moved away from
      // the point the camera is looking at, to close it over the next frames.
      alignmentGapRef.current = currentPos.clone().sub(controlsRef.current.target);
      prevPlanetPosRef.current = currentPos.clone();
      trackedPlanetIdRef.current = selectedPlanet.id;
      return;
    }

    // 1. Follow the orbit: move the camera and its look-at point by the same
    // step the planet travelled this frame.
    const orbitDelta = orbitDeltaRef.current.copy(currentPos).sub(prevPlanetPosRef.current);
    if (orbitDelta.lengthSq() > 1e-8) {
      controlsRef.current.target.add(orbitDelta);
      camera.position.add(orbitDelta);
    }

    // 2. Fix the aim: close most of the leftover gap each frame, which lands
    // on the planet in about half a second. Runs together with the step above.
    if (alignmentGapRef.current && alignmentGapRef.current.lengthSq() > 1e-4) {
      const t = 1 - Math.exp(-delta * 6);
      const correction = correctionRef.current.copy(alignmentGapRef.current).multiplyScalar(t);
      controlsRef.current.target.add(correction);
      camera.position.add(correction);
      alignmentGapRef.current.sub(correction);
    } else {
      alignmentGapRef.current = null;
    }

    controlsRef.current.update();
    prevPlanetPosRef.current = currentPos.clone();
  });

  return null;
}
