import { memo } from 'react';
import type { Planet } from '../../types/planet';

interface PlanetInfoProps {
  planet: Planet | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<Planet['type'], string> = {
  terrestrial: 'Terrestrial',
  'gas-giant': 'Gas Giant',
  'ice-giant': 'Ice Giant',
  dwarf: 'Dwarf Planet',
  star: 'Star',
};

const TYPE_ICONS: Record<Planet['type'], string> = {
  terrestrial: '🌍',
  'gas-giant': '🪐',
  'ice-giant': '🔵',
  dwarf: '⚫',
  star: '⭐',
};

export const PlanetInfo = memo(({ planet, onClose }: PlanetInfoProps) => {
  if (!planet) return null;

  const typeLabel = TYPE_LABELS[planet.type] ?? planet.type;
  const typeIcon = TYPE_ICONS[planet.type] ?? '🌑';
  const distanceMkm = (planet.distanceFromSun / 1e6).toFixed(1);

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-700 shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-5 border-b flex items-center gap-4"
        style={{ borderColor: planet.baseColor }}
      >
        {/* Planet image / icon */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-offset-2 ring-offset-zinc-950 flex-shrink-0"
             style={{ borderColor: planet.baseColor }}>
          <img
            src={planet.texture}
            alt={planet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (sibling) sibling.hidden = false;
            }}
          />
          <span className="hidden text-4xl flex items-center justify-center h-full w-full" hidden>
            {typeIcon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2
            className="text-3xl font-bold tracking-tighter"
            style={{ color: planet.baseColor }}
          >
            {planet.name}
          </h2>
          <span className="inline-block px-3 py-1 mt-1 text-xs font-medium rounded-full bg-zinc-900 text-zinc-300">
            {typeLabel}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors text-2xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Physical Data */}
        <section>
          <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">Physical Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Diameter</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.diameter.toLocaleString()} km</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Temperature</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.temperature} K</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Distance from Sun</p>
              <p className="text-2xl font-semibold text-white mt-1">{distanceMkm} M km</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Satellites</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.numberOfSatellites}</p>
            </div>
          </div>
        </section>

        {/* Motion */}
        <section>
          <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">Motion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Rotation Speed</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.rotationSpeed.toFixed(4)} rad/s</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">Orbit Speed</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.orbitSpeed.toFixed(4)}</p>
            </div>
          </div>
        </section>

        {/* Satellites */}
        {planet.satellites && planet.satellites.length > 0 && (
          <section>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">Known Moons</h3>
            <div className="flex flex-wrap gap-2">
              {planet.satellites.map((s) => (
                <span
                  key={s.name}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 text-sm rounded-2xl"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Fun Fact */}
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-amber-400 text-sm font-medium mb-3">Did you know?</h3>
          <p className="text-zinc-300 leading-relaxed">{planet.funFact}</p>
        </section>
      </div>
    </div>
  );
});