import { memo } from 'react';
import type { Planet } from '../../types/planet';
import { useLanguage } from '../../context/LanguageContext';

interface PlanetInfoProps {
  planet: Planet | null;
  /** Hides the panel while keeping the planet selected so the mobile FAB can reopen it. */
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
    <aside
      className="pointer-events-auto ui-slide-left-in fixed inset-x-2 top-20 bottom-3 z-[60] flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950/95 shadow-2xl backdrop-blur-xl md:inset-x-auto md:bottom-0 md:right-0 md:w-96 md:max-w-none md:rounded-none md:border-y-0 md:border-r-0"
      aria-label={t('planetInfoPanel')}
      aria-labelledby="planet-info-title"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-3 py-3 sm:px-6 sm:py-5 sm:gap-4"
        style={{ borderColor: planet.baseColor }}
      >
        {/* Planet image / icon */}
        <div
          className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-zinc-950 sm:h-14 sm:w-14"
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
            id="planet-info-title"
            className="text-xl font-bold tracking-tighter sm:text-3xl"
            style={{ color: planet.baseColor }}
          >
            {planetName}
          </h2>
          <span className="mt-1 inline-block rounded-full bg-zinc-900 px-2.5 py-0.5 text-[0.68rem] font-medium text-zinc-300 sm:px-3 sm:py-1 sm:text-xs">
            {typeLabel}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onCollapse && (
            <button
              type="button"
              onClick={onCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-2xl leading-none text-zinc-300 transition-all hover:-translate-y-0.5 hover:bg-zinc-900 hover:text-white active:scale-95 md:hidden"
              aria-label={t('hidePlanetInfo')}
            >
              ▾
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-xl leading-none text-zinc-400 transition-all hover:rotate-90 hover:bg-zinc-900 hover:text-white active:scale-95 sm:h-9 sm:w-9 sm:text-2xl"
            aria-label={t('aboutClose')}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5 overflow-y-auto p-3 sm:space-y-8 sm:p-6">
        {/* Physical Data */}
        <section>
          <h3 className="mb-2 text-[0.65rem] uppercase tracking-widest text-zinc-500 sm:mb-4 sm:text-xs">{t('physicalData')}</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
              <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('diameter')}</p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{planet.diameter.toLocaleString()} km</p>
            </div>
            <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
              <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('temperature')}</p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{planet.temperature} K</p>
            </div>
            {isStar ? (
              <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
                <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('systemRole')}</p>
                <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{t('center')}</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
                <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('distanceFromSun')}</p>
                <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{distanceMkm} M km</p>
              </div>
            )}
            <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
              <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('satellites')}</p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{planet.numberOfSatellites}</p>
            </div>
          </div>
        </section>

        {/* Motion */}
        <section>
          <h3 className="mb-2 text-[0.65rem] uppercase tracking-widest text-zinc-500 sm:mb-4 sm:text-xs">{t('motion')}</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
              <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('rotationSpeed')}</p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{planet.rotationSpeed.toFixed(4)} rad/s</p>
            </div>
            <div className="rounded-2xl bg-zinc-900/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/20 sm:rounded-3xl sm:p-4">
              <p className="text-[0.68rem] text-zinc-400 sm:text-xs">{t('orbitSpeed')}</p>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">{planet.orbitSpeed.toFixed(4)}</p>
            </div>
          </div>
        </section>

        {/* Satellites */}
        {planet.satellites && planet.satellites.length > 0 && (
          <section>
            <h3 className="mb-2 text-[0.65rem] uppercase tracking-widest text-zinc-500 sm:mb-4 sm:text-xs">{t('knownMoons')}</h3>
            <div className="flex flex-wrap gap-2">
              {planet.satellites.map((s) => (
                <span
                  key={s.name}
                  className="rounded-2xl bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
                >
                  {getSatelliteName(s)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Fun Fact */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/10 sm:rounded-3xl sm:p-6">
          <h3 className="mb-2 text-sm font-medium text-amber-400 sm:mb-3">{t('didYouKnow')}</h3>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{getPlanetFunFact(planet)}</p>
        </section>
      </div>
    </aside>
  );
});