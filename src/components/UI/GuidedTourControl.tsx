import { memo } from "react";
import type { Planet } from "../../types/planet";
import { useLanguage } from "../../context/LanguageContext";

interface GuidedTourControlProps {
  active: boolean;
  paused: boolean;
  currentIndex: number;
  total: number;
  currentPlanet?: Planet;
  onStart: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePause: () => void;
}

// The guided tour is intentionally a DOM overlay instead of a 3D object:
// it stays readable, accessible and responsive while the camera moves.
function TourIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12c2.5-5.5 13.5-5.5 16 0" />
      <path d="M7 15c2.2 2.5 7.8 2.5 10 0" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M8 5.75c0-.9.99-1.45 1.76-.98l9.12 5.75a1.15 1.15 0 0 1 0 1.96l-9.12 5.75A1.15 1.15 0 0 1 8 17.25V5.75z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M7.25 5.5A1.25 1.25 0 0 1 8.5 4.25h1A1.25 1.25 0 0 1 10.75 5.5v13A1.25 1.25 0 0 1 9.5 19.75h-1a1.25 1.25 0 0 1-1.25-1.25v-13zm6 0a1.25 1.25 0 0 1 1.25-1.25h1a1.25 1.25 0 0 1 1.25 1.25v13a1.25 1.25 0 0 1-1.25 1.25h-1a1.25 1.25 0 0 1-1.25-1.25v-13z" />
    </svg>
  );
}

export const GuidedTourControl = memo(({
  active,
  paused,
  currentIndex,
  total,
  currentPlanet,
  onStart,
  onStop,
  onPrevious,
  onNext,
  onTogglePause,
}: GuidedTourControlProps) => {
  const { getPlanetName, t } = useLanguage();
  const progress = total > 0 ? `${currentIndex + 1}/${total}` : "0/0";
  const currentName = currentPlanet ? getPlanetName(currentPlanet) : t("solarSystem");

  if (!active) {
    // Idle state: a compact call-to-action that does not compete with the scene.
    return (
      <button
        type="button"
        onClick={onStart}
        className="pointer-events-auto ui-panel-in ui-soft-pulse fixed right-3 top-20 z-[45] flex items-center gap-2 rounded-full border border-yellow-400/40 bg-zinc-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-zinc-900/95 hover:text-yellow-200 active:scale-95 md:left-1/2 md:right-auto md:top-24 md:-translate-x-1/2 md:px-4 md:tracking-[0.2em]"
        aria-label={t("startGuidedTour")}
      >
        <TourIcon className="h-4 w-4" />
        {t("guidedTour")}
      </button>
    );
  }

  return (
    // Active state: lightweight transport controls for a cinematic walkthrough.
    <section
      className="pointer-events-auto ui-panel-in fixed left-1/2 top-24 z-[65] w-[min(calc(100vw-1.5rem),28rem)] -translate-x-1/2 overflow-hidden rounded-3xl border border-yellow-400/30 bg-zinc-950/90 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl"
      aria-label={t("guidedTour")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ui-soft-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-500/20">
            <TourIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-yellow-300">
              {t("guidedTour")}
            </p>
            <p className="truncate text-lg font-bold text-white">{currentName}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStop}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-2xl leading-none text-zinc-400 transition-all hover:rotate-90 hover:bg-zinc-900 hover:text-white active:scale-95"
          aria-label={t("stopGuidedTour")}
        >
          ×
        </button>
      </div>

      <div className="grid gap-3 px-4 py-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            // Progress is driven by the current tour index, not time, so manual
            // next/previous interactions remain predictable.
            className="h-full rounded-full bg-yellow-400 transition-all duration-700 ease-out"
            style={{ width: `${((currentIndex + 1) / Math.max(total, 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2">
          <span className="font-mono text-xs font-semibold text-zinc-400">
            {progress}
          </span>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-lg text-white transition-all hover:-translate-x-0.5 hover:border-yellow-400/60 hover:text-yellow-300 active:scale-95"
              aria-label={t("previousTourStep")}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onTogglePause}
              className="flex h-10 w-12 items-center justify-center rounded-xl bg-white text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
              aria-label={paused ? t("resumeGuidedTour") : t("pauseGuidedTour")}
              title={paused ? t("resumeGuidedTour") : t("pauseGuidedTour")}
            >
              {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-lg text-white transition-all hover:translate-x-0.5 hover:border-yellow-400/60 hover:text-yellow-300 active:scale-95"
              aria-label={t("nextTourStep")}
            >
              ›
            </button>
          </div>

          <span aria-hidden="true" />
        </div>
      </div>
    </section>
  );
});
