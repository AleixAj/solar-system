import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  onOpenAbout: () => void;
}

const ThreeJsIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M18 1.5 L34.5 30.5 L1.5 30.5 Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M18 9 L26.25 23.5 L9.75 23.5 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.55"
    />
    <line x1="18" y1="1.5" x2="18" y2="30.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    <line x1="9.75" y1="16.5" x2="26.25" y2="16.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
  </svg>
);

const SpainFlag = () => (
  <svg
    className="h-5 w-7 rounded-[3px] shadow-sm"
    viewBox="0 0 28 20"
    role="img"
    aria-label="Spanish flag"
  >
    <rect width="28" height="20" fill="#AA151B" />
    <rect y="5" width="28" height="10" fill="#F1BF00" />
    <rect x="7" y="7" width="3" height="5" rx="0.6" fill="#C60B1E" />
  </svg>
);

const UkFlag = () => (
  <svg
    className="h-5 w-7 rounded-[3px] shadow-sm"
    viewBox="0 0 28 20"
    role="img"
    aria-label="United Kingdom flag"
  >
    <rect width="28" height="20" fill="#012169" />
    <path d="M0 0 28 20M28 0 0 20" stroke="#FFFFFF" strokeWidth="4" />
    <path d="M0 0 28 20M28 0 0 20" stroke="#C8102E" strokeWidth="2" />
    <path d="M14 0v20M0 10h28" stroke="#FFFFFF" strokeWidth="6" />
    <path d="M14 0v20M0 10h28" stroke="#C8102E" strokeWidth="3.2" />
  </svg>
);

export const Header = memo(({ onOpenAbout }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-auto bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-screen-2xl mx-auto px-3 py-3 sm:px-5 sm:py-4 lg:px-6 flex items-center justify-between gap-3 lg:gap-6">
        {/* Brand */}
        <div className="flex min-w-0 shrink items-center gap-x-1.5 sm:gap-x-3">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-sm shadow-lg shadow-yellow-500/50 transition-transform duration-300 hover:rotate-12 hover:scale-105 sm:h-8 sm:w-8 sm:text-xl">
            ☀️
          </div>
          <div className="min-w-0 leading-none">
            <span className="text-sm font-bold tracking-tight text-white sm:text-xl sm:tracking-tighter md:text-2xl">
              SOLAR
            </span>
            <span className="text-sm font-bold tracking-tight text-yellow-400 sm:text-xl sm:tracking-tighter md:text-2xl">
              EXPLORER
            </span>
          </div>
        </div>

        <div className="hidden lg:block text-center">
          <span className="text-sm uppercase tracking-[2px] text-zinc-400 font-medium">
            {t('interactiveSimulation')}
          </span>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-500">
            <span>{t('craftedWith')}</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <ThreeJsIcon />
              <span className="font-medium">Three.js</span>
            </span>
            <span>{t('craftedBy')}</span>
            <span className="font-semibold text-white">Aleix</span>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-1"
            role="group"
            aria-label={t('languageSelector')}
          >
            <button
              onClick={() => setLanguage('es')}
              className={`inline-flex h-8 w-9 sm:h-9 sm:w-10 items-center justify-center rounded-xl border text-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                language === 'es'
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                  : 'border-transparent bg-zinc-900/70 hover:border-zinc-600'
              }`}
              aria-label="Ver en español"
              aria-pressed={language === 'es'}
              title="Español"
            >
              <SpainFlag />
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`inline-flex h-8 w-9 sm:h-9 sm:w-10 items-center justify-center rounded-xl border text-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                language === 'en'
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                  : 'border-transparent bg-zinc-900/70 hover:border-zinc-600'
              }`}
              aria-label="View in English"
              aria-pressed={language === 'en'}
              title="English"
            >
              <UkFlag />
            </button>
          </div>

          <button
            onClick={onOpenAbout}
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border border-yellow-300 rounded-2xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-yellow-500/35"
            aria-label={t('aboutButton')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950/70" />
            <span className="hidden sm:inline">{t('aboutButton')}</span>
            <span className="sm:hidden">{language === 'es' ? 'Info' : 'Info'}</span>
          </button>
        </div>
      </div>
    </header>
  );
});