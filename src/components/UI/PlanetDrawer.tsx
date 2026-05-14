import { memo } from "react";
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
          className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-auto max-h-[85vh] bg-zinc-950 border-t border-zinc-700 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mt-3 mb-2" />

          {/* Title */}
          <h2 className="px-6 text-xl font-semibold text-white">{t('solarSystem')}</h2>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {planets.map((planet) => {
              const isSelected = selectedPlanet?.id === planet.id;

              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelect(planet)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all ${
                    isSelected
                      ? "bg-zinc-900 shadow-inner"
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