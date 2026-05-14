import { memo } from "react";
import type { Planet } from "../../types/planet";
import { useLanguage } from "../../context/LanguageContext";

interface PlanetNavigationProps {
  planets: Planet[];
  selectedPlanet: Planet | null;
  onSelectPlanet: (planet: Planet) => void;
  onOverview: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const PlanetNavigation = memo(({
  planets,
  selectedPlanet,
  onSelectPlanet,
  onOverview,
  collapsed,
  onToggleCollapsed,
}: PlanetNavigationProps) => {
  const { getPlanetName, t } = useLanguage();

  return (
    <>
      <nav
        id="planet-navigation-panel"
        aria-hidden={collapsed}
        inert={collapsed}
        aria-label={t("planetNavAria")}
        className={`pointer-events-auto fixed bottom-0 left-0 top-20 z-40 hidden w-72 flex-col border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-md transition-transform duration-300 ease-out md:flex ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
      {/* Current planet / Header */}
      <div className="flex min-h-[3.5rem] shrink-0 items-center justify-between gap-3 border-b border-zinc-800 py-2.5 pl-4 pr-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {selectedPlanet ? (
            <>
              <div
                className="h-4 w-4 shrink-0 self-center rounded-full ring-2 ring-offset-2 ring-offset-zinc-950"
                style={{ backgroundColor: selectedPlanet.baseColor }}
              />
              <span className="truncate text-lg font-semibold leading-snug text-white">
                {getPlanetName(selectedPlanet)}
              </span>
            </>
          ) : (
            <span className="truncate text-lg font-semibold leading-snug text-zinc-400">
              {t('solarSystem')}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={t("collapseSidebar")}
          aria-expanded={!collapsed}
          aria-controls="planet-navigation-panel"
          className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-xl border border-zinc-500 bg-zinc-800 text-zinc-100 shadow-sm transition-colors hover:border-yellow-400/70 hover:bg-zinc-700 hover:text-yellow-300"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </button>
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
      <div className="border-t border-zinc-800 p-4 text-center text-xs text-zinc-500">
        {t('clickToExplore')}
      </div>
    </nav>

      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={t("expandSidebar")}
          aria-expanded={false}
          aria-controls="planet-navigation-panel"
          className="pointer-events-auto fixed left-0 top-20 z-[45] hidden h-12 w-9 items-center justify-center rounded-r-xl border border-l-0 border-zinc-500 bg-zinc-800/95 text-xl leading-none text-yellow-400 shadow-md backdrop-blur-sm transition-colors hover:border-yellow-400/60 hover:bg-zinc-700 hover:text-yellow-300 md:flex"
        >
          <span aria-hidden="true">›</span>
        </button>
      )}
    </>
  );
});