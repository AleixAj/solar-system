import { useMemo, memo } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { useLanguage } from "../../context/LanguageContext";

const SPEED_STEPS = [0, 0.25, 0.5, 1, 2, 5, 10];

export const TimeControl = memo(() => {
  const { timeScale, setTimeScale, isPaused, togglePause } = useSimulation();
  const { t } = useLanguage();

  const sliderIndex = useMemo(
    () => Math.max(0, SPEED_STEPS.indexOf(timeScale)),
    [timeScale]
  );

  return (
    <div className="pointer-events-auto ui-panel-in fixed bottom-3 left-1/2 z-40 flex max-w-[min(100vw-1rem,22rem)] -translate-x-1/2 items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950/95 px-3 py-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-zinc-500 sm:bottom-6 sm:max-w-none sm:gap-3 sm:rounded-3xl sm:px-5 sm:py-3 md:bottom-8 md:gap-4 md:px-6">
      {/* Play / Pause Button */}
      <button
        onClick={togglePause}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-2xl text-white transition-all hover:scale-110 hover:text-yellow-400 active:scale-95 sm:h-10 sm:w-10 sm:text-3xl"
        aria-label={isPaused ? t("resume") : t("pause")}
        title={isPaused ? t("resume") : t("pause")}
      >
        {isPaused ? "▶" : "⏸"}
      </button>

      {/* Speed Control */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <span className="hidden shrink-0 text-xs font-medium uppercase tracking-widest text-zinc-400 sm:inline">
          {t("speed")}
        </span>

        <input
          type="range"
          min={0}
          max={SPEED_STEPS.length - 1}
          step={1}
          value={sliderIndex}
          onChange={(e) => setTimeScale(SPEED_STEPS[Number(e.target.value)])}
          disabled={isPaused}
          aria-label={t("speed")}
          aria-valuetext={`${timeScale}×`}
          className="h-2 min-w-0 w-full flex-1 cursor-pointer rounded-full bg-zinc-800 accent-yellow-400 sm:w-48 sm:flex-none sm:max-w-none md:w-48"
        />

        <span className="shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-white sm:text-lg sm:min-w-[2.5rem]">
          {timeScale}×
        </span>
      </div>
    </div>
  );
});