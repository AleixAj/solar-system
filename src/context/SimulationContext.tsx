import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface SimulationContextValue {
  /** Time multiplier used by the scene. It is 0 while paused. Range 0 to 10 */
  timeScale: number;
  /** Change the multiplier. Negative values are clamped to 0 */
  setTimeScale: (scale: number) => void;
  /** True while the simulation is paused */
  isPaused: boolean;
  /** Switch between paused and running */
  togglePause: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

/**
 * Holds the speed of the simulation.
 *
 * Everything that moves (planets, moons, spin) multiplies its own speed by
 * timeScale, so pausing or speeding up the whole scene happens here.
 */
export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [timeScale, setTimeScaleRaw] = useState(0.25);
  const [isPaused, setIsPaused] = useState(false);

  const setTimeScale = useCallback((scale: number) => {
    setTimeScaleRaw(Math.max(0, scale));
  }, []);

  const togglePause = useCallback(() => setIsPaused((p) => !p), []);

  const value = useMemo(
    () => ({
      // Pausing reports 0 but keeps the chosen speed, so resuming restores it.
      timeScale: isPaused ? 0 : timeScale,
      setTimeScale,
      isPaused,
      togglePause,
    }),
    [isPaused, timeScale, setTimeScale, togglePause]
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulation = (): SimulationContextValue => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
};
