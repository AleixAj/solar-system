import { memo } from "react";

interface FloatingMenuButtonProps {
  onClick: () => void;
  /** Whether the controlled element (drawer or panel) is currently open/visible */
  isOpen: boolean;
  /** When true the FAB controls the info panel; when false it controls the drawer */
  hasPlanetSelected: boolean;
}

function getIcon(hasPlanetSelected: boolean, isOpen: boolean): string {
  if (hasPlanetSelected) {
    return isOpen ? "▾" : "▴";   // Panel mode
  }
  return isOpen ? "✕" : "🪐";    // Drawer mode
}

function getLabel(hasPlanetSelected: boolean, isOpen: boolean): string {
  if (hasPlanetSelected) {
    return isOpen ? "Hide planet info" : "Show planet info";
  }
  return isOpen ? "Close planet menu" : "Open planet menu";
}

export const FloatingMenuButton = memo(
  ({ onClick, isOpen, hasPlanetSelected }: FloatingMenuButtonProps) => (
    <button
      onClick={onClick}
      aria-label={getLabel(hasPlanetSelected, isOpen)}
      aria-expanded={isOpen}
      className="fixed bottom-8 right-8 z-[60] w-14 h-14 flex items-center justify-center text-3xl rounded-3xl bg-zinc-900 hover:bg-yellow-500 active:scale-95 transition-all shadow-2xl shadow-black/50 border border-zinc-700 hover:border-yellow-400 text-white hover:text-zinc-950"
    >
      <span className="transition-transform duration-200">
        {getIcon(hasPlanetSelected, isOpen)}
      </span>
    </button>
  )
);