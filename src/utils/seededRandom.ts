/**
 * Random numbers that always come out the same for a given seed.
 *
 * The scene is built once from these values, and a seed keeps the stars and
 * the asteroids in the same place on every reload instead of jumping around.
 */
export function createSeededRandom(seed: number): () => number {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
