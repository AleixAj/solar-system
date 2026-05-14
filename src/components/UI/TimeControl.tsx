import { useMemo, memo } from "react";
import { useSimulation } from "../../context/SimulationContext";

const SPEED_STEPS = [0.1, 0.25, 0.5, 1, 2, 5, 10];

export const TimeControl = memo(() => {
  const { timeScale, setTimeScale, isPaused, togglePause } = useSimulation();

  const sliderIndex = useMemo(
    () => Math.max(0, SPEED_STEPS.indexOf(timeScale)),
    [timeScale]
  );

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-3xl px-6 py-3 flex items-center gap-4">
      {/* Play / Pause Button */}
      <button
        onClick={togglePause}
        className="w-10 h-10 flex items-center justify-center text-3xl text-white hover:text-yellow-400 transition-colors"
        aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? "▶" : "⏸"}
      </button>

      {/* Speed Control */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest font-medium text-zinc-400">SPEED</span>

        <input
          type="range"
          min={0}
          max={SPEED_STEPS.length - 1}
          step={1}
          value={sliderIndex}
          onChange={(e) => setTimeScale(SPEED_STEPS[Number(e.target.value)])}
          disabled={isPaused}
          className="w-48 accent-yellow-400 bg-zinc-800 h-2 rounded-full cursor-pointer"
        />

        <span className="font-mono text-lg font-semibold text-white min-w-[38px] text-right">
          {timeScale}×
        </span>
      </div>
    </div>
  );
});