import type { ThreeEvent } from "@react-three/fiber";

/**
 * Pointer props shared by every clickable body in the scene: show a pointer
 * cursor over the mesh and tell the parent component about the hover state.
 *
 * Spread it on a mesh: <mesh {...pointerCursorProps(onHover)} />
 */
export function pointerCursorProps(onHover?: (hovered: boolean) => void) {
  return {
    onPointerEnter: (event: ThreeEvent<PointerEvent>) => {
      // Stop here so the planet behind this one does not light up too.
      event.stopPropagation();
      document.body.style.cursor = "pointer";
      onHover?.(true);
    },
    onPointerLeave: () => {
      document.body.style.cursor = "auto";
      onHover?.(false);
    },
  };
}
