import { memo } from "react";

export const Lights = memo(() => {
  return (
    <>
      {/* Ambient light: main brightness source, keeps texture colors vivid. */}
      <ambientLight intensity={1.8} />

      {/* Light at the Sun position, so planets are lit from the center. */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        distance={5000}
        decay={0.8}
        color="#fff5e0"
      />

      {/* Fill light so the dark side of a planet is not pure black. */}
      <pointLight
        position={[300, 150, -300]}
        intensity={0.8}
        color="#ffffff"
        distance={4000}
        decay={0.6}
      />

      {/* Second fill, from below, for planets on the far side of the Sun. */}
      <pointLight
        position={[-300, -100, 300]}
        intensity={0.6}
        color="#ffffff"
        distance={4000}
        decay={0.6}
      />
    </>
  );
});
