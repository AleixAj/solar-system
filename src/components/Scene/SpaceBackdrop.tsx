import { memo } from "react";
import { useTexture } from "@react-three/drei";
import { BackSide } from "three";

const BACKDROP_TEXTURE = "/stars_wallpaper.jpg";

useTexture.preload(BACKDROP_TEXTURE);

export const SpaceBackdrop = memo(() => {
  const texture = useTexture(BACKDROP_TEXTURE);

  return (
    <mesh frustumCulled={false} renderOrder={-1000} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[12000, 48, 32]} />
      <meshBasicMaterial
        map={texture}
        color="#5f6684"
        side={BackSide}
        // The backdrop stays opaque and is only darkened by the color tint.
        // Making it transparent would wash out the whole scene.
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
});
