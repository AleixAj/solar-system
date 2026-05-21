import { memo, useEffect, useRef } from "react";
import type { Planet } from "../../types/planet";
import { useLanguage } from "../../context/LanguageContext";

interface PlanetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet: (planet: Planet) => void;
  planets: Planet[];
  selectedPlanet: Planet | null;
}

export const PlanetDrawer = memo(
  ({ isOpen, onClose, onSelectPlanet, planets, selectedPlanet }: PlanetDrawerProps) => {
    const { getPlanetName, t } = useLanguage();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (!isOpen) return;
      // Mobile drawer behaves like a modal sheet, so focus should enter it.
      closeButtonRef.current?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (planet: Planet) => {
      onSelectPlanet(planet);
      onClose();
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[70] pointer-events-auto bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          className="ui-panel-in fixed bottom-0 left-0 right-0 z-[80] pointer-events-auto max-h-[85vh] bg-zinc-950 border-t border-zinc-700 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planet-drawer-title"
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mt-3 mb-2" aria-hidden="true" />

          {/* Title */}
          <div className="flex items-center justify-between gap-3 px-6">
            <h2 id="planet-drawer-title" className="text-xl font-semibold text-white">{t('solarSystem')}</h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl leading-none text-zinc-400 transition-all hover:rotate-90 hover:bg-zinc-900 hover:text-white active:scale-95"
              aria-label={t('aboutClose')}
            >
              ×
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {planets.map((planet) => {
              const isSelected = selectedPlanet?.id === planet.id;

              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelect(planet)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 hover:translate-x-1 ${
                    isSelected
                      ? "bg-zinc-900 shadow-inner ring-1 ring-yellow-400/20"
                      : "hover:bg-zinc-900/70"
                  }`}
                >
                  {/* Colored dot */}
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.baseColor }}
                  />

                  <span
                    className={`flex-1 text-left font-medium ${
                      isSelected ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {getPlanetName(planet)}
                  </span>

                  {isSelected && (
                    <span className="text-yellow-400 text-2xl">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }
);