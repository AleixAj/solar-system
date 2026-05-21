import { memo } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface FloatingMenuButtonProps {
  onClick: () => void;
  /** Whether the controlled element (drawer or panel) is currently open/visible */
  isOpen: boolean;
  /** When true the FAB controls the info panel; when false it controls the drawer */
  hasPlanetSelected: boolean;
}

function getIcon(hasPlanetSelected: boolean, isOpen: boolean): string {
  if (hasPlanetSelected) return isOpen ? "▾" : "▴";
  return isOpen ? "✕" : "🪐";    // Drawer mode
}

function getLabel(
  hasPlanetSelected: boolean,
  isOpen: boolean,
  t: ReturnType<typeof useLanguage>["t"]
): string {
  if (hasPlanetSelected) {
    return isOpen ? t("hidePlanetInfo") : t("showPlanetInfo");
  }
  return isOpen ? t("aboutClose") : t("openPlanetMenu");
}

export const FloatingMenuButton = memo(
  ({ onClick, isOpen, hasPlanetSelected }: FloatingMenuButtonProps) => {
    const { t } = useLanguage();

    return (
      <button
        onClick={onClick}
        aria-label={getLabel(hasPlanetSelected, isOpen, t)}
        aria-expanded={isOpen}
        className={`fixed left-4 top-20 z-[60] pointer-events-auto h-12 min-w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950/90 px-3 text-2xl text-white shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400 hover:text-yellow-300 active:scale-95 md:hidden ${hasPlanetSelected && isOpen ? "max-md:hidden" : "flex"}`}
      >
        <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          {getIcon(hasPlanetSelected, isOpen)}
        </span>
      </button>
    );
  }
);