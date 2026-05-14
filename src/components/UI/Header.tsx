import { memo } from 'react';

interface HeaderProps {
  onOpenAbout: () => void;
}

export const Header = memo(({ onOpenAbout }: HeaderProps) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
    <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-x-3">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xl shadow-lg shadow-yellow-500/50">
          ☀️
        </div>
        <div>
          <span className="text-2xl font-bold tracking-tighter text-white">SOLAR</span>
          <span className="text-2xl font-bold tracking-tighter text-yellow-400">EXPLORER</span>
        </div>
      </div>

      {/* About button */}
      <button
        onClick={onOpenAbout}
        className="px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-2xl transition-colors"
      >
        About this project
      </button>

      {/* Tagline */}
      <div className="hidden md:block text-center">
        <span className="text-sm uppercase tracking-[2px] text-zinc-400 font-medium">
          Interactive 3D Simulation
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-x-2 text-sm">
        <span className="text-zinc-400">by</span>
        <span className="font-semibold text-white">Aleix</span>
      </div>
    </div>
  </header>
));