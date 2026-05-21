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
        color="#4c5878"
        side={BackSide}
        // Keep the backdrop opaque and darkened by tint only; transparency would
        // blend over the whole scene and make planets look dimmer.
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
});
