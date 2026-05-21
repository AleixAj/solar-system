import { memo } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface FloatingMenuButtonProps {
  onClick: () => void;
  onOpenPlanetMenu?: () => void;
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
  ({ onClick, onOpenPlanetMenu, isOpen, hasPlanetSelected }: FloatingMenuButtonProps) => {
    const { t } = useLanguage();

    if (hasPlanetSelected) {
      return (
        <div className="pointer-events-auto fixed left-4 top-20 z-50 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onClick}
            aria-label={getLabel(hasPlanetSelected, isOpen, t)}
            aria-expanded={isOpen}
            className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-yellow-400/50 bg-zinc-950/90 px-3 text-sm font-bold uppercase tracking-[0.14em] text-yellow-300 shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:text-yellow-200 active:scale-95"
          >
            Info
          </button>

          <button
            type="button"
            onClick={onOpenPlanetMenu}
            aria-label={t("openPlanetMenu")}
            aria-expanded={false}
            className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950/90 px-3 text-2xl text-white shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400 hover:text-yellow-300 active:scale-95"
          >
            <span aria-hidden="true">🪐</span>
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={getLabel(hasPlanetSelected, isOpen, t)}
        aria-expanded={isOpen}
        className="pointer-events-auto fixed left-4 top-20 z-[60] flex h-12 min-w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950/90 px-3 text-2xl text-white shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400 hover:text-yellow-300 active:scale-95 md:hidden"
      >
        <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          {getIcon(hasPlanetSelected, isOpen)}
        </span>
      </button>
    );
  }
);