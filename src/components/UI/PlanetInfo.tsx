import { memo } from 'react';
import type { Planet } from '../../types/planet';
import { useLanguage } from '../../context/LanguageContext';

interface PlanetInfoProps {
  planet: Planet | null;
  /** Solo oculta el panel; el planeta sigue seleccionado (p. ej. FAB para volver a abrir). */
  onCollapse?: () => void;
  onClose: () => void;
}

const TYPE_ICONS: Record<Planet['type'], string> = {
  terrestrial: '🌍',
  'gas-giant': '🪐',
  'ice-giant': '🔵',
  dwarf: '⚫',
  star: '⭐',
};

export const PlanetInfo = memo(({ planet, onCollapse, onClose }: PlanetInfoProps) => {
  const { getPlanetFunFact, getPlanetName, getSatelliteName, getTypeLabel, t } = useLanguage();

  if (!planet) return null;

  const planetName = getPlanetName(planet);
  const typeLabel = getTypeLabel(planet.type);
  const typeIcon = TYPE_ICONS[planet.type] ?? '🌑';
  const isStar = planet.type === 'star';
  const distanceMkm = (planet.distanceFromSun / 1e6).toFixed(1);

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-20 bottom-0 z-[60] flex w-full flex-col overflow-hidden border-l border-zinc-700 bg-zinc-950/95 shadow-2xl backdrop-blur-xl md:left-auto md:right-0 md:w-96 md:max-w-none">
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-4 py-4 sm:px-6 sm:py-5 sm:gap-4"
        style={{ borderColor: planet.baseColor }}
      >
        {/* Planet image / icon */}
        <div
          className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-zinc-950 sm:h-14 sm:w-14"
          style={{ borderColor: planet.baseColor }}
        >
          <img
            src={planet.texture}
            alt={planetName}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (sibling) sibling.hidden = false;
            }}
          />
          <span className="hidden flex h-full w-full items-center justify-center text-4xl" hidden>
            {typeIcon}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="text-2xl font-bold tracking-tighter sm:text-3xl"
            style={{ color: planet.baseColor }}
          >
            {planetName}
          </h2>
          <span className="mt-1 inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
            {typeLabel}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xl leading-none text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white md:hidden"
              aria-label={t('hidePlanetInfo')}
            >
              ▾
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-2xl leading-none text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
            aria-label={t('aboutClose')}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-6">
        {/* Physical Data */}
        <section>
          <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">{t('physicalData')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">{t('diameter')}</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.diameter.toLocaleString()} km</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">{t('temperature')}</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.temperature} K</p>
            </div>
            {isStar ? (
              <div className="bg-zinc-900/50 rounded-3xl p-4">
                <p className="text-xs text-zinc-400">{t('systemRole')}</p>
                <p className="text-2xl font-semibold text-white mt-1">{t('center')}</p>
              </div>
            ) : (
              <div className="bg-zinc-900/50 rounded-3xl p-4">
                <p className="text-xs text-zinc-400">{t('distanceFromSun')}</p>
                <p className="text-2xl font-semibold text-white mt-1">{distanceMkm} M km</p>
              </div>
            )}
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">{t('satellites')}</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.numberOfSatellites}</p>
            </div>
          </div>
        </section>

        {/* Motion */}
        <section>
          <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">{t('motion')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">{t('rotationSpeed')}</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.rotationSpeed.toFixed(4)} rad/s</p>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl p-4">
              <p className="text-xs text-zinc-400">{t('orbitSpeed')}</p>
              <p className="text-2xl font-semibold text-white mt-1">{planet.orbitSpeed.toFixed(4)}</p>
            </div>
          </div>
        </section>

        {/* Satellites */}
        {planet.satellites && planet.satellites.length > 0 && (
          <section>
            <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">{t('knownMoons')}</h3>
            <div className="flex flex-wrap gap-2">
              {planet.satellites.map((s) => (
                <span
                  key={s.name}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 text-sm rounded-2xl"
                >
                  {getSatelliteName(s)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Fun Fact */}
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-amber-400 text-sm font-medium mb-3">{t('didYouKnow')}</h3>
          <p className="text-zinc-300 leading-relaxed">{getPlanetFunFact(planet)}</p>
        </section>
      </div>
    </div>
  );
});