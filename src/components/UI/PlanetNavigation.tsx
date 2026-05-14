import { memo } from "react";
import type { Planet } from "../../types/planet";
import { useLanguage } from "../../context/LanguageContext";

interface PlanetNavigationProps {
  planets: Planet[];
  selectedPlanet: Planet | null;
  onSelectPlanet: (planet: Planet) => void;
  onOverview: () => void;
}

export const PlanetNavigation = memo(({
  planets,
  selectedPlanet,
  onSelectPlanet,
  onOverview,
}: PlanetNavigationProps) => {
  const { getPlanetName, t } = useLanguage();

  return (
    <nav
      className="fixed left-0 top-16 bottom-0 w-72 pointer-events-auto bg-zinc-950/95 backdrop-blur-md border-r border-zinc-800 z-40 hidden md:flex flex-col"
      aria-label="Planet navigation"
    >
      {/* Current planet / Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          {selectedPlanet ? (
            <>
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-zinc-950"
                style={{ backgroundColor: selectedPlanet.baseColor }}
              />
              <span className="truncate text-lg font-semibold text-white">
                {getPlanetName(selectedPlanet)}
              </span>
            </>
          ) : (
            <span className="truncate text-lg font-semibold text-zinc-400">
              {t('solarSystem')}
            </span>
          )}
        </div>

        <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
          ☉
        </span>
      </div>

      {/* Overview Button */}
      <button
        onClick={onOverview}
        className={`mx-4 mt-4 px-4 py-3 flex items-center gap-3 text-left rounded-2xl transition-all hover:bg-zinc-900 ${
          !selectedPlanet
            ? "bg-zinc-900 text-white shadow-inner"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <span className="text-xl">☀️</span>
        <span className="font-medium">{t('overview')}</span>
      </button>

      {/* Planets List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {planets.map((planet) => {
          const isActive = selectedPlanet?.id === planet.id;

          return (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                isActive
                  ? "bg-zinc-900 shadow-inner"
                  : "hover:bg-zinc-900/70"
              }`}
            >
              {/* Colored dot */}
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-zinc-900 transition-transform ${
                  isActive ? "ring-yellow-400 scale-110" : "ring-transparent group-hover:ring-zinc-700"
                }`}
                style={{ backgroundColor: planet.baseColor }}
              />

              <span
                className={`font-medium transition-colors ${
                  isActive ? "text-white" : "text-zinc-300 group-hover:text-white"
                }`}
              >
                {getPlanetName(planet)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer sutil */}
      <div className="p-4 text-xs text-zinc-500 text-center border-t border-zinc-800">
        {t('clickToExplore')}
      </div>
    </nav>
  );
});